class Phaser4Viewer {
    constructor() {
        this.currentExample = null;
        this.currentVersion = null;
        this.sourceCode = null;
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
        });

        document.getElementById('mobile-btn').addEventListener('click', () => {
            this.openInMode('mobile.html');
        });

        document.getElementById('edit-btn').addEventListener('click', () => {
            this.openInMode('edit.html');
        });

        document.getElementById('source-btn').addEventListener('click', () => {
            this.showSourceModal();
        });

        document.getElementById('open-local-file-btn').addEventListener('click', () => {
            this.openLocalFile();
        });

        document.getElementById('download-url-btn').addEventListener('click', () => {
            this.downloadFromURL();
        });

        document.getElementById('clone-repo-btn').addEventListener('click', () => {
            this.cloneRepo();
        });

        // Version selector
        const versionSelect = document.getElementById('version-select');
        versionSelect.addEventListener('change', (e) => {
            const newVersion = e.target.value;
            this.switchToVersion(newVersion);
        });

        // Modal controls
        document.getElementById('close-source').addEventListener('click', () => {
            this.hideSourceModal();
        });

        // Close modal when clicking outside
        document.getElementById('source-modal').addEventListener('click', (e) => {
            if (e.target.id === 'source-modal') {
                this.hideSourceModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSourceModal();
                this.hideUrlModal();
                this.hideAlertModal();
            }
        });

        // URL Modal
        document.getElementById('close-url-modal').addEventListener('click', () => this.hideUrlModal());
        document.getElementById('url-modal').addEventListener('click', (e) => {
            if (e.target.id === 'url-modal') {
                this.hideUrlModal();
            }
        });

        // Alert Modal
        document.getElementById('close-alert-modal').addEventListener('click', () => this.hideAlertModal());
        document.getElementById('alert-ok-btn').addEventListener('click', () => this.hideAlertModal());
        document.getElementById('alert-modal').addEventListener('click', (e) => {
            if (e.target.id === 'alert-modal') {
                this.hideAlertModal();
            }
        });
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
        exampleScript.textContent = this.sourceCode;

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

            const response = await fetch(sourceUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.sourceCode = await response.text();
        } catch (error) {
            throw new Error('Failed to load source code: ' + error.message);
        }
    }

    openInMode(page) {
        const url = `${page}?src=${encodeURIComponent(this.currentExample)}&v=${encodeURIComponent(this.currentVersion)}`;
        window.open(url, '_blank');
    }

    showSourceModal() {
        const modal = document.getElementById('source-modal');
        const sourceCode = document.getElementById('source-code');
        const githubLink = document.getElementById('github-link');

        // Set source code
        sourceCode.textContent = this.sourceCode || 'Source code not available';

        // Set GitHub link
        const githubUrl = `https://github.com/phaserjs/examples/blob/master/public/${this.currentExample}`;
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

    showUrlModal(title, callback, showBranchInput = false) {
        document.getElementById('url-modal-title').textContent = title;
        const modal = document.getElementById('url-modal');
        modal.classList.add('visible');
        const input = document.getElementById('url-input');
        input.value = '';
        input.focus();

        const branchInput = document.getElementById('branch-input');
        branchInput.style.display = showBranchInput ? 'block' : 'none';
        branchInput.value = '';

        const submitBtn = document.getElementById('url-submit-btn');
        const submitHandler = () => {
            const url = input.value;
            if (url) {
                this.hideUrlModal();
                callback(url, branchInput.value);
            }
        };

        submitBtn.onclick = submitHandler;
    }

    hideUrlModal() {
        const modal = document.getElementById('url-modal');
        modal.classList.remove('visible');
    }

    showAlert(message) {
        document.getElementById('alert-message').textContent = message;
        const modal = document.getElementById('alert-modal');
        modal.classList.add('visible');
        document.getElementById('alert-ok-btn').focus();
    }

    hideAlertModal() {
        const modal = document.getElementById('alert-modal');
        modal.classList.remove('visible');
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

    openLocalFile() {
        const fileChooser = document.createElement('input');
        fileChooser.type = 'file';
        fileChooser.accept = '.js'; // Only accept JavaScript files
        fileChooser.style.display = 'none';

        fileChooser.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    const fileName = file.name;
                    this.addFileToExamples(fileName, content);
                };
                reader.readAsText(file);
            }
        });

        document.body.appendChild(fileChooser);
        fileChooser.click();
        document.body.removeChild(fileChooser);
    }

    async downloadFromURL() {
        this.showUrlModal("Enter the URL of the JavaScript file to download:", async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const content = await response.text();
                const fileName = url.substring(url.lastIndexOf('/') + 1);
                this.addFileToExamples(fileName, content);
            } catch (error) {
                console.error('Download error:', error);
                this.showError(`Failed to download file: ${error.message}`);
            }
        });
    }

    async cloneRepo() {
        this.showUrlModal("Enter the GitHub repository URL:", async (repoUrl, branch) => {
            const branchName = branch || 'main';
            repoUrl = repoUrl.replace('https://github.com/', 'https://codeload.github.com/') + `/zip/${branchName}`;

            try {
                const response = await fetch(repoUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const blob = await response.blob();
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
                    fs.root.getFile('repo.zip', { create: true, exclusive: false }, (fileEntry) => {
                        this.writeFile(fileEntry, blob, () => {
                            const zipTo = fs.root.toURL() + 'examples/';
                            window.zip.unzip(fileEntry.toURL(), zipTo, (status) => {
                                if (status === 0) {
                                    console.log("Unzip successful");
                                    this.scanDirectory(zipTo);
                                    this.showAlert('Repository cloned and unzipped successfully!');
                                } else {
                                    console.error("Unzip failed with status: " + status);
                                    this.showError(`Failed to unzip repository. Status: ${status}`);
                                }
                            }, (progress) => {
                                console.log('Unzip progress: ' + Math.round((progress.loaded / progress.total) * 100) + '%');
                            });
                        });
                    }, (err) => {
                        console.error("Get file error: " + err);
                        this.showError(`Failed to get file: ${err.code}`);
                    });
                }, (err) => {
                    console.error("File system error: " + err);
                    this.showError(`Failed to access file system: ${err.code}`);
                });
            } catch (error) {
                console.error('Download error:', error);
                this.showError(`Failed to download repository: ${error.message}`);
            }
        }, true);
    }

    scanDirectory(directory, root) {
        window.resolveLocalFileSystemURL(directory, (dirEntry) => {
            const reader = dirEntry.createReader();
            reader.readEntries((entries) => {
                // Find the root directory of the repository
                if (!root && entries.length > 0 && entries[0].isDirectory) {
                    root = entries[0].name;
                }

                entries.forEach((entry) => {
                    if (entry.isDirectory) {
                        this.scanDirectory(entry.toURL(), root);
                    } else if (entry.isFile && entry.name.endsWith('.js')) {
                        const path = entry.fullPath.substring(entry.fullPath.indexOf(root) + root.length + 1);
                        entry.file((file) => {
                            const reader = new FileReader();
                            reader.onloadend = (e) => {
                                this.addFileToExamples(path, e.target.result);
                            };
                            reader.readAsText(file);
                        });
                    }
                });
            }, (err) => {
                console.error("Read entries error: " + err);
                this.showError('Failed to read directory entries.');
            });
        }, (err) => {
            console.error("Resolve file system URL error: " + err);
            this.showError('Failed to resolve directory URL.');
        });
    }

    addFileToExamples(fileName, content) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
            fs.root.getDirectory('examples', { create: true }, (dirEntry) => {
                dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
                    this.writeFile(fileEntry, content);
                }, (err) => {
                    console.error("Get file error: " + err);
                    this.showError('Failed to get file.');
                });
            }, (err) => {
                console.error("Get directory error: " + err);
                this.showError('Failed to get directory.');
            });
        }, (err) => {
            console.error("File system error: " + err);
            this.showError('Failed to access file system.');
        });
    }

    writeFile(fileEntry, dataObj, onComplete) {
        fileEntry.createWriter((fileWriter) => {
            fileWriter.onwriteend = () => {
                console.log("Successful file write...");
                if (onComplete) {
                    onComplete();
                } else {
                    this.updateExamplesJson(fileEntry.name);
                }
            };

            fileWriter.onerror = (e) => {
                console.error("Failed file write: " + e.toString());
                this.showError('Failed to write file.');
            };

            if (typeof dataObj === 'string') {
                dataObj = new Blob([dataObj], { type: 'text/plain' });
            }
            fileWriter.write(dataObj);
        });
    }

    updateExamplesJson(newFileName) {
        const filePath = 'examples.json';
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
            fs.root.getFile(filePath, { create: false }, (fileEntry) => {
                fileEntry.file((file) => {
                    const reader = new FileReader();
                    reader.onloadend = (e) => {
                        const examples = JSON.parse(e.target.result);
                        const newExample = {
                            path: `examples/${newFileName}`,
                            name: newFileName,
                            birthtimeMs: Date.now()
                        };

                        // Check if a 'downloaded' category exists, if not create it
                        let downloadedCategory = examples.children.find(child => child.name === 'downloaded');
                        if (!downloadedCategory) {
                            downloadedCategory = {
                                path: 'src/downloaded',
                                name: 'downloaded',
                                children: [],
                                birthtimeMs: Date.now()
                            };
                            examples.children.push(downloadedCategory);
                        }

                        downloadedCategory.children.push(newExample);

                        // Write the updated examples.json back to the file
                        this.writeFile(fileEntry, JSON.stringify(examples, null, 2));

                        this.showAlert(`Example ${newFileName} added successfully!`);
                    };
                    reader.readAsText(file);
                }, (err) => {
                    console.error("File read error: " + err);
                    this.showError('Failed to read examples.json.');
                });
            }, (err) => {
                console.error("Get file error: " + err);
                this.showError('Failed to find examples.json.');
            });
        }, (err) => {
            console.error("File system error: " + err);
            this.showError('Failed to access file system.');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Phaser4Viewer();
});
