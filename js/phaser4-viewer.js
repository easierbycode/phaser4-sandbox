class Phaser4Viewer {
    constructor() {
        this.currentExample = null;
        this.currentVersion = null;
        this.sourceCode = null;
        this.originalSourceCode = null;
        this.returnPath = null;
        this.isModuleExample = false;
        this.init();
    }

    init() {
        // Get example source from URL
        const src = getQueryString('src');
        if (!src) {
            this.showError('No example specified');
            return;
        }

        this.currentExample = src;

        // Check if this is a module example
        this.isModuleExample = getQueryString('module') === 'true';

        // Setup return path for back button
        this.returnPath = getQueryString('return') || 'index.html';

        // Setup event listeners
        this.setupEventListeners();

        // Initialize version selector
        this.initializeVersionSelector();

        // Load and display the example
        this.loadExample();
    }

    setupEventListeners() {
        // Back button
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', () => {
            let returnUrl = this.returnPath;

            // For module examples, make return URL absolute to avoid base href issues
            if (this.isModuleExample && !returnUrl.startsWith('http')) {
                const currentBase = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                returnUrl = currentBase + returnUrl;
            }

            window.location.href = returnUrl;
        });

        // Control buttons
        document.getElementById('fullscreen-btn').addEventListener('click', async () => {
            this.toggleFullscreen();
        });

        document.getElementById('source-btn').addEventListener('click', () => {
            this.showSourceModal();
        });

        // Version selector
        const versionSelect = document.getElementById('version-select');
        versionSelect.addEventListener('change', (e) => {
            const newVersion = e.target.value;
            this.switchToVersion(newVersion);
        });

        // Edit button
        document.getElementById('edit-btn').addEventListener('click', () => {
            this.showEditModal();
        });

        // Modal controls
        document.getElementById('close-source').addEventListener('click', () => {
            this.hideSourceModal();
        });

        document.getElementById('close-edit').addEventListener('click', () => {
            this.hideEditModal();
        });

        document.getElementById('run-code-btn').addEventListener('click', () => {
            this.runEditedCode();
        });

        document.getElementById('reset-code-btn').addEventListener('click', () => {
            this.resetCode();
        });

        // Tab key support in textarea
        document.getElementById('edit-code').addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const ta = e.target;
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                ta.value = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
                ta.selectionStart = ta.selectionEnd = start + 4;
            }
        });

        // Close modals when clicking outside
        document.getElementById('source-modal').addEventListener('click', (e) => {
            if (e.target.id === 'source-modal') {
                this.hideSourceModal();
            }
        });

        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.hideEditModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSourceModal();
                this.hideEditModal();
            } else if (e.key.toLowerCase() === 'f') {
                this.toggleFullscreen();
            }
        });
    }

    async toggleFullscreen() {
        const container = document.getElementById('phaser-example');
        const target = container ? container.querySelector('canvas') || container : null;

        if (!target) {
            console.warn('No canvas found for fullscreen request.');
            return;
        }

        const requestFullscreen =
            target.requestFullscreen ||
            target.webkitRequestFullscreen ||
            target.msRequestFullscreen;

        if (!requestFullscreen) {
            console.warn('Fullscreen API not supported.');
            return;
        }

        try {
            await requestFullscreen.call(target);
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
        }
    }

    initializeVersionSelector() {
        const versionSelect = document.getElementById('version-select');

        // Populate version options
        versions.forEach(version => {
            const option = document.createElement('option');
            option.value = version.val;
            option.textContent = version.text;
            versionSelect.appendChild(option);
        });

        // Set default version
        this.currentVersion = getQueryString('v', versions[0].val);
        versionSelect.value = this.currentVersion;
    }

    async loadExample() {
        const loadingIndicator = document.getElementById('loading');
        const exampleContainer = document.getElementById('phaser-example');

        try {
            // Show loading state
            loadingIndicator.style.display = 'block';
            exampleContainer.innerHTML = '';

            // Set base href for module examples before loading anything else
            if (this.isModuleExample) {
                this.setupBaseHrefForModule();
            }

            // Update page title
            const title = this.getExampleTitle();
            document.getElementById('example-title').textContent = title;
            document.title = `${title} - Phaser 4 Example`;

            // Load source code
            await this.loadSourceCode();

            // Load Phaser and run the example
            await this.loadPhaserAndRunExample();

        } catch (error) {
            console.error('Failed to load example:', error);
            this.showError('Failed to load example: ' + error.message);
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    setupBaseHrefForModule() {
        // Extract the folder path from the example path
        // First decode the URL and normalize path separators
        let examplePath = decodeURIComponent(this.currentExample);
        examplePath = examplePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes

        // e.g., "src/games/avoid the germs/main.js" -> "src/games/avoid the germs/"
        const folderPath = examplePath.substring(0, examplePath.lastIndexOf('/') + 1);

        // console.log('Setting base href for module example:', folderPath);

        // First, make all existing relative URLs absolute before setting base href
        this.makeAssetsAbsolute();

        // Create and inject base tag
        const baseTag = document.createElement('base');
        baseTag.href = folderPath;
        document.head.insertBefore(baseTag, document.head.firstChild);
    }

    makeAssetsAbsolute() {
        // Get the current page's base URL (before we change it)
        const currentBase = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

        // Update favicon
        const favicon = document.querySelector('link[rel="shortcut icon"]');
        if (favicon && favicon.href.startsWith(currentBase)) {
            favicon.href = currentBase + 'images/favicon.ico';
        }

        // Update CSS
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]:not([href^="http"])');
        cssLinks.forEach(link => {
            if (!link.href.startsWith('http')) {
                const relativePath = link.getAttribute('href');
                link.href = currentBase + relativePath;
            }
        });

        // Update images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.startsWith(currentBase) && img.getAttribute('src')) {
                const relativePath = img.getAttribute('src');
                if (!relativePath.startsWith('http')) {
                    img.src = currentBase + relativePath;
                }
            }
        });

        // Update scripts (except CDN ones)
        const scripts = document.querySelectorAll('script[src]:not([src^="http"])');
        scripts.forEach(script => {
            const relativePath = script.getAttribute('src');
            if (!relativePath.startsWith('http')) {
                script.src = currentBase + relativePath;
            }
        });
    }

    async loadPhaserAndRunExample() {
        return new Promise((resolve, reject) => {

            // Check if it's Phaser 4
            const isPhaser4 = this.currentVersion.startsWith('4');

            // Create and load Phaser script
            const phaserScript = document.createElement('script');
            phaserScript.id = 'phaser-script';
            // phaserScript.type = isPhaser4 ? 'module' : 'text/javascript';
            phaserScript.type = 'text/javascript';
            // phaserScript.async = true;

            phaserScript.onload = () => {
                this.runExample().then(resolve).catch(reject);
            };

            phaserScript.onerror = () => {
                reject(new Error('Failed to load Phaser script'));
            };

            // Set Phaser script source - use absolute path for module examples
            const phaserVersionJS = this.currentVersion + '.js';
            if (this.isModuleExample) {
                // Use absolute path to avoid base href issues
                const currentBase = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                phaserScript.src = `${currentBase}build/${phaserVersionJS}`;
            } else {
                phaserScript.src = `./build/${phaserVersionJS}`;
            }

            document.head.appendChild(phaserScript);
        });
    }

    async runExample() {
        if (!this.sourceCode) {
            throw new Error('No source code loaded');
        }

        // Determine script type
        let scriptType = 'text/javascript';

        // If this is explicitly a module example, use module type
        if (this.isModuleExample) {
            scriptType = 'module';
        } else if (this.sourceCode.startsWith('// #module')) {
            // Otherwise, check for module comment in the source
            scriptType = 'module';
        } else if (this.usesModuleSyntax(this.sourceCode)) {
            // Auto-detect ES module syntax
            scriptType = 'module';
        }

        // Create and inject example script
        const exampleScript = document.createElement('script');
        exampleScript.id = 'example-script';
        exampleScript.type = scriptType;

        // Wrap non-module scripts in an IIFE to prevent redeclaration errors
        // when re-running edited code (let/const/class can't be redeclared in global scope)
        if (scriptType === 'text/javascript') {
            exampleScript.textContent = `(function() {\n${this.sourceCode}\nif (typeof game !== 'undefined') { window.game = game; }\n})();`;
        } else {
            exampleScript.textContent = this.sourceCode;
        }

        document.body.appendChild(exampleScript);
    }

    usesModuleSyntax(source) {
        if (!source) {
            return false;
        }

        // Remove comments before scanning
        const withoutBlockComments = source.replace(/\/\*[\s\S]*?\*\//g, '');
        const cleanedSource = withoutBlockComments.replace(/\/\/.*$/gm, '');

        const importExportPattern = /(^|\n)\s*(import|export)\s+(?!\()/;
        const dynamicImportPattern = /(^|\n)\s*import\s*\(/;

        return importExportPattern.test(cleanedSource) || dynamicImportPattern.test(cleanedSource);
    }

    getExampleTitle() {
        if (!this.currentExample) return 'Loading...';

        // Extract title from path and clean it up
        let path = this.currentExample;

        // Remove "src\" or "src/" prefix if present
        if (path.toLowerCase().startsWith('src\\') || path.toLowerCase().startsWith('src/')) {
            path = path.substring(4);
        }

        const parts = path.split(/[\/\\]/);
        const filename = parts[parts.length - 1];
        return filename.replace(/\.(js|json)$/, '').replace(/[-_]/g, ' ')
            .split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
    }

    async loadSourceCode() {
        try {
            let sourceUrl = this.currentExample;

            // For module examples, use absolute path to avoid base href issues
            if (this.isModuleExample) {
                const currentBase = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                sourceUrl = currentBase + this.currentExample;
            }

            // Check if running in Cordova
            if (typeof cordova !== 'undefined' && window.metadataManager) {
                // Wait for Cordova file plugin to be ready
                await window.metadataManager.waitForCordova();

                if (!cordova.file) {
                    throw new Error('Cordova file plugin not available');
                }

                // In Cordova, fetch doesn't work for local files. Use File API.
                // We assume currentExample is a relative path from the root of the app
                const absolutePath = cordova.file.applicationDirectory + 'www/' + this.currentExample;
                console.log('Cordova loading source from:', absolutePath);
                this.sourceCode = await window.metadataManager.readCordovaFile(absolutePath);
            } else {
                const response = await fetch(sourceUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.sourceCode = await response.text();
            }
            this.originalSourceCode = this.sourceCode;
        } catch (error) {
            throw new Error('Failed to load source code: ' + error.message);
        }
    }

    showSourceModal() {
        const modal = document.getElementById('source-modal');
        const sourceCode = document.getElementById('source-code');
        const githubLink = document.getElementById('github-link');

        // Set source code
        sourceCode.textContent = this.sourceCode || 'Source code not available';

        // Set GitHub link
        const encodedPath = this.currentExample.split('/').map(encodeURIComponent).join('/');
        const githubUrl = `https://github.com/easierbycode/phaser4-sandbox/blob/master/public/${encodedPath}`;
        githubLink.href = githubUrl;

        // Apply syntax highlighting with Prism
        if (window.Prism && this.sourceCode) {
            Prism.highlightElement(sourceCode);
        }

        // Show modal
        modal.style.display = 'block';

        // Focus on modal for accessibility
        modal.focus();
    }

    hideSourceModal() {
        const modal = document.getElementById('source-modal');
        modal.style.display = 'none';
    }

    showEditModal() {
        const modal = document.getElementById('edit-modal');
        document.getElementById('edit-code').value = this.sourceCode || '';
        modal.style.display = 'block';
        document.getElementById('edit-code').focus();
    }

    hideEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    async runEditedCode() {
        const newCode = document.getElementById('edit-code').value;
        this.sourceCode = newCode;

        // Destroy any existing Phaser game instance
        if (window.game && typeof window.game.destroy === 'function') {
            window.game.destroy(true);
            window.game = null;
        }

        // Clear the example container
        const container = document.getElementById('phaser-example');
        container.innerHTML = '';

        // Remove old example script tag
        const oldScript = document.getElementById('example-script');
        if (oldScript) oldScript.remove();

        // Re-run with updated code
        await this.runExample();

        this.hideEditModal();
    }

    resetCode() {
        if (this.originalSourceCode !== undefined) {
            document.getElementById('edit-code').value = this.originalSourceCode;
        }
    }

    showError(message) {
        const exampleContainer = document.getElementById('phaser-example');
        const loadingIndicator = document.getElementById('loading');

        loadingIndicator.style.display = 'none';
        exampleContainer.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                background: #f8f9fa;
                border-radius: 10px;
                border: 2px dashed #dee2e6;
                text-align: center;
                color: #6c757d;
                flex-direction: column;
                gap: 1rem;
            ">
                <div style="font-size: 48px;">⚠️</div>
                <div style="font-size: 18px; font-weight: 600;">Error Loading Example</div>
                <div style="font-size: 14px;">${message}</div>
                <button onclick="location.reload()" style="
                    padding: 10px 20px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                ">Try Again</button>
            </div>
        `;
    }

    switchToVersion(newVersion) {
        // Build new URL with updated version parameter
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('v', newVersion);

        // Reload the page with the new version
        window.location.href = currentUrl.toString();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Phaser4Viewer();
});
