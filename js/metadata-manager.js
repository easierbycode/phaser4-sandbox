/**
 * Metadata Manager for Phaser 4 Sandbox
 * Manages the examples.json metadata and automatically detects scenes in JavaScript files
 */

class MetadataManager {
    constructor() {
        this.metadata = null;
        this.localStorageKey = 'phaser4_examples_metadata';
    }

    /**
     * Load metadata from examples.json or localStorage
     */
    async loadMetadata() {
        try {
            // Try to load from localStorage first (for user-added examples)
            const localData = localStorage.getItem(this.localStorageKey);
            if (localData) {
                this.metadata = JSON.parse(localData);
                return this.metadata;
            }

            // Check for pre-loaded data for Cordova
            if (window.EXAMPLES_DATA) {
                this.metadata = window.EXAMPLES_DATA;
                return this.metadata;
            }

            // Fall back to examples.json
            const response = await fetch('examples.json');
            this.metadata = await response.json();
            return this.metadata;
        } catch (error) {
            console.error('Failed to load metadata:', error);
            throw error;
        }
    }

    /**
     * Save metadata to localStorage
     */
    saveMetadata() {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.metadata));
            console.log('Metadata saved successfully');
        } catch (error) {
            console.error('Failed to save metadata:', error);
            throw error;
        }
    }

    /**
     * Parse a JavaScript file to extract scene information
     * @param {string} content - The JavaScript file content
     * @returns {Object} Scene information
     */
    parseSceneInfo(content) {
        const sceneInfo = {
            hasScene: false,
            className: null,
            sceneName: null,
            config: null
        };

        try {
            // Look for class extending Phaser.Scene
            const classMatch = content.match(/class\s+(\w+)\s+extends\s+Phaser\.Scene/);
            if (classMatch) {
                sceneInfo.hasScene = true;
                sceneInfo.className = classMatch[1];
            }

            // Look for scene configuration
            const configMatch = content.match(/const\s+config\s*=\s*\{([^}]+)\}/s);
            if (configMatch) {
                sceneInfo.config = configMatch[0];
            }

            // Try to extract a descriptive name from comments
            const titleComment = content.match(/\/\*\*?\s*\n?\s*\*?\s*([^\n*]+)/);
            if (titleComment) {
                sceneInfo.sceneName = titleComment[1].trim();
            }

            return sceneInfo;
        } catch (error) {
            console.error('Error parsing scene info:', error);
            return sceneInfo;
        }
    }

    /**
     * Add a new file to the metadata
     * @param {string} filePath - The file path (e.g., "src/custom/my-example.js")
     * @param {string} content - The file content
     * @param {string} displayName - Optional display name
     */
    async addFile(filePath, content, displayName = null) {
        if (!this.metadata) {
            await this.loadMetadata();
        }

        // Parse the file to detect scenes
        const sceneInfo = this.parseSceneInfo(content);

        // Determine the category path from the file path
        const pathParts = filePath.split('/').filter(p => p);
        const fileName = pathParts.pop();

        // Find or create the category structure
        let currentCategory = this.metadata;
        let currentPath = '';

        for (const part of pathParts) {
            currentPath += (currentPath ? '\\' : '') + part;

            // Look for existing category
            let existingCategory = null;
            if (currentCategory.children) {
                existingCategory = currentCategory.children.find(
                    child => child.name === part && child.children
                );
            }

            if (existingCategory) {
                currentCategory = existingCategory;
            } else {
                // Create new category
                if (!currentCategory.children) {
                    currentCategory.children = [];
                }

                const newCategory = {
                    path: currentPath,
                    name: part,
                    children: [],
                    birthtimeMs: Date.now()
                };

                currentCategory.children.push(newCategory);
                currentCategory = newCategory;
            }
        }

        // Add the file to the current category
        if (!currentCategory.children) {
            currentCategory.children = [];
        }

        // Generate display name
        let finalDisplayName = displayName;
        if (!finalDisplayName) {
            finalDisplayName = fileName.replace('.js', '').replace('.json', '');
            // If scene info available, use that
            if (sceneInfo.sceneName) {
                finalDisplayName = sceneInfo.sceneName;
            }
        }

        // Check if file already exists
        const existingFile = currentCategory.children.find(
            child => child.name === finalDisplayName || child.path === filePath
        );

        if (existingFile) {
            console.log('File already exists in metadata, updating...');
            existingFile.birthtimeMs = Date.now();
            existingFile.sceneInfo = sceneInfo;
        } else {
            // Add new file
            currentCategory.children.push({
                path: filePath,
                name: finalDisplayName,
                birthtimeMs: Date.now(),
                sceneInfo: sceneInfo,
                userAdded: true
            });
        }

        // Save the updated metadata
        this.saveMetadata();

        // Trigger a metadata update event
        window.dispatchEvent(new CustomEvent('metadata-updated', {
            detail: { filePath, displayName: finalDisplayName }
        }));

        console.log('File added to metadata:', filePath);
        return this.metadata;
    }

    /**
     * Remove a file from the metadata
     * @param {string} filePath - The file path to remove
     */
    async removeFile(filePath) {
        if (!this.metadata) {
            await this.loadMetadata();
        }

        // Recursively search and remove the file
        const removeFromCategory = (category) => {
            if (!category.children) return false;

            const index = category.children.findIndex(
                child => child.path === filePath
            );

            if (index !== -1) {
                category.children.splice(index, 1);
                return true;
            }

            // Search in subcategories
            for (const child of category.children) {
                if (child.children && removeFromCategory(child)) {
                    return true;
                }
            }

            return false;
        };

        const removed = removeFromCategory(this.metadata);

        if (removed) {
            this.saveMetadata();
            window.dispatchEvent(new CustomEvent('metadata-updated', {
                detail: { filePath, removed: true }
            }));
            console.log('File removed from metadata:', filePath);
        }

        return removed;
    }

    /**
     * Search for examples in the metadata
     * @param {string} query - Search query
     * @returns {Array} Array of matching files
     */
    searchExamples(query) {
        if (!this.metadata) {
            return [];
        }

        const results = [];
        const lowerQuery = query.toLowerCase();

        const searchCategory = (category) => {
            if (!category.children) return;

            for (const child of category.children) {
                if (child.children) {
                    // It's a category, search recursively
                    searchCategory(child);
                } else {
                    // It's a file, check if it matches
                    if (child.name.toLowerCase().includes(lowerQuery) ||
                        child.path.toLowerCase().includes(lowerQuery) ||
                        (child.sceneInfo && child.sceneInfo.sceneName &&
                         child.sceneInfo.sceneName.toLowerCase().includes(lowerQuery))) {
                        results.push(child);
                    }
                }
            }
        };

        searchCategory(this.metadata);
        return results;
    }

    /**
     * Get all user-added examples
     * @returns {Array} Array of user-added files
     */
    getUserAddedExamples() {
        if (!this.metadata) {
            return [];
        }

        const userFiles = [];

        const collectUserFiles = (category) => {
            if (!category.children) return;

            for (const child of category.children) {
                if (child.children) {
                    collectUserFiles(child);
                } else if (child.userAdded) {
                    userFiles.push(child);
                }
            }
        };

        collectUserFiles(this.metadata);
        return userFiles;
    }

    /**
     * Export metadata to JSON string
     */
    exportMetadata() {
        return JSON.stringify(this.metadata, null, 2);
    }

    /**
     * Import metadata from JSON string
     * @param {string} jsonString - JSON string to import
     */
    importMetadata(jsonString) {
        try {
            this.metadata = JSON.parse(jsonString);
            this.saveMetadata();
            window.dispatchEvent(new CustomEvent('metadata-updated', {
                detail: { imported: true }
            }));
            console.log('Metadata imported successfully');
        } catch (error) {
            console.error('Failed to import metadata:', error);
            throw error;
        }
    }

    /**
     * Reset metadata to the original examples.json
     */
    async resetMetadata() {
        localStorage.removeItem(this.localStorageKey);
        const response = await fetch('examples.json');
        this.metadata = await response.json();
        window.dispatchEvent(new CustomEvent('metadata-updated', {
            detail: { reset: true }
        }));
        console.log('Metadata reset to original');
    }
}

// Create global instance
window.metadataManager = new MetadataManager();
