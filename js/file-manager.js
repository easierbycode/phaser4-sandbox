/**
 * File Manager for Phaser 4 Sandbox
 * Handles downloading, creating, and editing files with Cordova File Plugin
 */

class FileManager {
    constructor() {
        this.fileSystem = null;
        this.baseDir = null;
        this.isCordova = typeof cordova !== 'undefined';
        this.init();
    }

    async init() {
        if (!this.isCordova) {
            console.warn('Cordova not detected. File operations will be limited.');
            return;
        }

        try {
            // Wait for device ready
            await this.waitForCordova();

            // Get the data directory
            this.baseDir = cordova.file.dataDirectory;

            console.log('FileManager initialized. Base directory:', this.baseDir);
        } catch (error) {
            console.error('Failed to initialize FileManager:', error);
        }
    }

    waitForCordova() {
        return new Promise((resolve) => {
            if (window.cordova) {
                document.addEventListener('deviceready', resolve, false);
            } else {
                resolve();
            }
        });
    }

    /**
     * Download a file from a URL
     * @param {string} url - The URL to download from
     * @param {string} fileName - The local file name to save as
     * @param {Function} progressCallback - Optional callback for progress updates
     * @returns {Promise<string>} - The local file path
     */
    async downloadFile(url, fileName, progressCallback) {
        if (!this.isCordova) {
            throw new Error('File download requires Cordova');
        }

        return new Promise((resolve, reject) => {
            const fileTransfer = new FileTransfer();
            const targetPath = this.baseDir + 'downloads/' + fileName;

            // Create downloads directory if it doesn't exist
            this.ensureDirectoryExists('downloads').then(() => {
                // Track progress
                if (progressCallback) {
                    fileTransfer.onprogress = (progressEvent) => {
                        if (progressEvent.lengthComputable) {
                            const percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                            progressCallback(percentLoaded);
                        }
                    };
                }

                // Download the file
                fileTransfer.download(
                    url,
                    targetPath,
                    (entry) => {
                        console.log('Download complete:', entry.toURL());
                        resolve(entry.toURL());
                    },
                    (error) => {
                        console.error('Download error:', error);
                        reject(error);
                    },
                    true // trustAllHosts for development
                );
            }).catch(reject);
        });
    }

    /**
     * Download a GitHub repository as a ZIP and extract it
     * @param {string} repoUrl - GitHub repository URL (e.g., https://github.com/user/repo)
     * @param {string} branch - Branch name (default: main)
     * @returns {Promise<string>} - The extracted directory path
     */
    async downloadGitHubRepo(repoUrl, branch = 'main') {
        // Convert GitHub URL to ZIP download URL
        // https://github.com/user/repo -> https://github.com/user/repo/archive/refs/heads/main.zip
        let zipUrl = repoUrl;
        if (!zipUrl.includes('/archive/')) {
            zipUrl = zipUrl.replace(/\/$/, '') + `/archive/refs/heads/${branch}.zip`;
        }

        const fileName = `github-repo-${Date.now()}.zip`;

        try {
            const zipPath = await this.downloadFile(zipUrl, fileName);
            console.log('GitHub repo downloaded:', zipPath);

            // Note: Extracting ZIP requires additional plugin (cordova-plugin-zip)
            // For now, just return the ZIP file path
            return zipPath;
        } catch (error) {
            throw new Error(`Failed to download GitHub repo: ${error.message}`);
        }
    }

    /**
     * Open and read a local file
     * @param {string} filePath - The file path to read
     * @returns {Promise<string>} - The file contents
     */
    async readFile(filePath) {
        if (!this.isCordova) {
            // Fallback for web: use fetch
            try {
                const response = await fetch(filePath);
                return await response.text();
            } catch (error) {
                throw new Error(`Failed to read file: ${error.message}`);
            }
        }

        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(filePath,
                (fileEntry) => {
                    fileEntry.file(
                        (file) => {
                            const reader = new FileReader();
                            reader.onloadend = function() {
                                resolve(this.result);
                            };
                            reader.onerror = reject;
                            reader.readAsText(file);
                        },
                        reject
                    );
                },
                reject
            );
        });
    }

    /**
     * Write content to a file
     * @param {string} filePath - The file path (relative to base directory)
     * @param {string} content - The content to write
     * @param {boolean} append - Whether to append or overwrite
     * @returns {Promise<string>} - The file URL
     */
    async writeFile(filePath, content, append = false) {
        if (!this.isCordova) {
            throw new Error('File writing requires Cordova');
        }

        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(this.baseDir,
                (dirEntry) => {
                    // Parse directory path and filename
                    const pathParts = filePath.split('/');
                    const fileName = pathParts.pop();
                    const dirPath = pathParts.join('/');

                    // Ensure directory exists
                    this.ensureDirectoryExists(dirPath).then(() => {
                        window.resolveLocalFileSystemURL(this.baseDir + dirPath,
                            (targetDir) => {
                                targetDir.getFile(fileName, { create: true },
                                    (fileEntry) => {
                                        fileEntry.createWriter(
                                            (fileWriter) => {
                                                fileWriter.onwriteend = () => {
                                                    console.log('File written successfully');
                                                    resolve(fileEntry.toURL());
                                                };
                                                fileWriter.onerror = reject;

                                                if (append) {
                                                    fileWriter.seek(fileWriter.length);
                                                }

                                                const blob = new Blob([content], { type: 'text/plain' });
                                                fileWriter.write(blob);
                                            },
                                            reject
                                        );
                                    },
                                    reject
                                );
                            },
                            reject
                        );
                    }).catch(reject);
                },
                reject
            );
        });
    }

    /**
     * Ensure a directory exists, creating it if necessary
     * @param {string} dirPath - The directory path relative to base directory
     * @returns {Promise<DirectoryEntry>}
     */
    async ensureDirectoryExists(dirPath) {
        if (!this.isCordova || !dirPath) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(this.baseDir,
                (dirEntry) => {
                    const folders = dirPath.split('/').filter(f => f);

                    const createDir = (parent, folders) => {
                        if (folders.length === 0) {
                            resolve(parent);
                            return;
                        }

                        const folderName = folders.shift();
                        parent.getDirectory(folderName, { create: true },
                            (newDir) => {
                                createDir(newDir, folders);
                            },
                            reject
                        );
                    };

                    createDir(dirEntry, folders);
                },
                reject
            );
        });
    }

    /**
     * List files in a directory
     * @param {string} dirPath - The directory path relative to base directory
     * @returns {Promise<Array>} - Array of file entries
     */
    async listFiles(dirPath = '') {
        if (!this.isCordova) {
            throw new Error('Directory listing requires Cordova');
        }

        return new Promise((resolve, reject) => {
            const fullPath = this.baseDir + dirPath;

            window.resolveLocalFileSystemURL(fullPath,
                (dirEntry) => {
                    const reader = dirEntry.createReader();
                    reader.readEntries(
                        (entries) => {
                            const files = entries.map(entry => ({
                                name: entry.name,
                                isDirectory: entry.isDirectory,
                                fullPath: entry.fullPath,
                                url: entry.toURL()
                            }));
                            resolve(files);
                        },
                        reject
                    );
                },
                reject
            );
        });
    }

    /**
     * Delete a file
     * @param {string} filePath - The file path to delete
     * @returns {Promise<void>}
     */
    async deleteFile(filePath) {
        if (!this.isCordova) {
            throw new Error('File deletion requires Cordova');
        }

        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(filePath,
                (fileEntry) => {
                    fileEntry.remove(
                        () => {
                            console.log('File deleted successfully');
                            resolve();
                        },
                        reject
                    );
                },
                reject
            );
        });
    }

    /**
     * Pick a file from the device (requires file picker plugin or file chooser)
     * For now, this is a placeholder that shows how to integrate
     */
    async pickFile() {
        // This would require additional plugin like cordova-plugin-filechooser
        // or cordova-plugin-file-picker
        throw new Error('File picker not yet implemented. Install cordova-plugin-filechooser');
    }

    /**
     * Request storage permissions on Android
     */
    async requestPermissions() {
        if (!this.isCordova || !cordova.plugins || !cordova.plugins.permissions) {
            return Promise.resolve(true);
        }

        const permissions = cordova.plugins.permissions;

        return new Promise((resolve, reject) => {
            permissions.requestPermissions(
                [
                    permissions.READ_EXTERNAL_STORAGE,
                    permissions.WRITE_EXTERNAL_STORAGE
                ],
                (status) => {
                    if (status.hasPermission) {
                        resolve(true);
                    } else {
                        reject(new Error('Storage permissions denied'));
                    }
                },
                reject
            );
        });
    }
}

// Create global instance
window.fileManager = new FileManager();
