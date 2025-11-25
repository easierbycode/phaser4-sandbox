/**
 * File Manager UI for Phaser 4 Sandbox
 * Provides a user interface for managing files
 */

class FileManagerUI {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create the UI button
        this.createButton();

        // Create the modal panel
        this.createModal();

        // Setup event listeners
        this.setupEventListeners();
    }

    createButton() {
        const button = document.createElement('button');
        button.id = 'file-manager-button';
        button.innerHTML = '📁 Manage Files';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('click', () => this.toggleModal());

        document.body.appendChild(button);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'file-manager-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        modal.innerHTML = `
            <div id="file-manager-panel" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a2e;
                border-radius: 20px;
                padding: 30px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #fff; margin: 0;">📁 File Manager</h2>
                    <button id="close-modal" style="
                        background: none;
                        border: none;
                        color: #fff;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                    ">×</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button class="tab-button active" data-tab="download" style="
                            flex: 1;
                            padding: 10px;
                            background: #667eea;
                            color: white;
                            border: none;
                            border-radius: 10px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Download File</button>
                        <button class="tab-button" data-tab="github" style="
                            flex: 1;
                            padding: 10px;
                            background: #2a2a3e;
                            color: white;
                            border: none;
                            border-radius: 10px;
                            cursor: pointer;
                            font-weight: 600;
                        ">GitHub Repo</button>
                        <button class="tab-button" data-tab="local" style="
                            flex: 1;
                            padding: 10px;
                            background: #2a2a3e;
                            color: white;
                            border: none;
                            border-radius: 10px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Local File</button>
                    </div>

                    <!-- Download File Tab -->
                    <div id="download-tab" class="tab-content" style="display: block;">
                        <div style="margin-bottom: 15px;">
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">File URL</label>
                            <input type="text" id="file-url-input" placeholder="https://example.com/example.js" style="
                                width: 100%;
                                padding: 12px;
                                background: #2a2a3e;
                                border: 1px solid #444;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                            ">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">Save As (filename)</label>
                            <input type="text" id="file-name-input" placeholder="my-example.js" style="
                                width: 100%;
                                padding: 12px;
                                background: #2a2a3e;
                                border: 1px solid #444;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                            ">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">Category Path (e.g., src/custom)</label>
                            <input type="text" id="category-path-input" placeholder="src/custom" value="src/custom" style="
                                width: 100%;
                                padding: 12px;
                                background: #2a2a3e;
                                border: 1px solid #444;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                            ">
                        </div>
                        <button id="download-file-btn" style="
                            width: 100%;
                            padding: 12px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 16px;
                        ">Download & Add to Examples</button>
                        <div id="download-progress" style="
                            margin-top: 10px;
                            color: #aaa;
                            display: none;
                        "></div>
                    </div>

                    <!-- GitHub Repo Tab -->
                    <div id="github-tab" class="tab-content" style="display: none;">
                        <div style="margin-bottom: 15px;">
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">GitHub Repository URL</label>
                            <input type="text" id="github-url-input" placeholder="https://github.com/username/repo" style="
                                width: 100%;
                                padding: 12px;
                                background: #2a2a3e;
                                border: 1px solid #444;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                            ">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">Branch</label>
                            <input type="text" id="github-branch-input" placeholder="main" value="main" style="
                                width: 100%;
                                padding: 12px;
                                background: #2a2a3e;
                                border: 1px solid #444;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                            ">
                        </div>
                        <button id="download-github-btn" style="
                            width: 100%;
                            padding: 12px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 16px;
                        ">Download GitHub Repo</button>
                        <div id="github-progress" style="
                            margin-top: 10px;
                            color: #aaa;
                            display: none;
                        "></div>
                    </div>

                    <!-- Local File Tab -->
                    <div id="local-tab" class="tab-content" style="display: none;">
                        <div style="margin-bottom: 15px;">
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">Upload or Paste JavaScript Code</label>
                            <textarea id="local-file-content" placeholder="Paste your Phaser scene code here..." style="
                                width: 100%;
                                min-height: 200px;
                                padding: 12px;
                                background: #2a2a3e;
                                border: 1px solid #444;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                                font-family: monospace;
                                resize: vertical;
                            "></textarea>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="color: #aaa; display: block; margin-bottom: 5px;">File Name</label>
                            <input type="text" id="local-file-name-input" placeholder="my-example.js" style="
                                width: 100%;
                                padding: 12px;
                                background: #2a2a3e;
                                border: 1px solid #444;
                                border-radius: 8px;
                                color: white;
                                font-size: 14px;
                            ">
                        </div>
                        <button id="add-local-file-btn" style="
                            width: 100%;
                            padding: 12px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 16px;
                        ">Add to Examples</button>
                    </div>
                </div>

                <!-- User Added Files Section -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444;">
                    <h3 style="color: #fff; margin-bottom: 15px;">📝 User Added Files</h3>
                    <div id="user-files-list" style="color: #aaa;">
                        Loading...
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    setupEventListeners() {
        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => this.toggleModal());
        document.getElementById('file-manager-modal').addEventListener('click', (e) => {
            if (e.target.id === 'file-manager-modal') {
                this.toggleModal();
            }
        });

        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });

        // Download file
        document.getElementById('download-file-btn').addEventListener('click', () => this.downloadFile());

        // Download GitHub repo
        document.getElementById('download-github-btn').addEventListener('click', () => this.downloadGitHubRepo());

        // Add local file
        document.getElementById('add-local-file-btn').addEventListener('click', () => this.addLocalFile());

        // Listen for metadata updates
        window.addEventListener('metadata-updated', () => this.refreshUserFilesList());
    }

    toggleModal() {
        this.isOpen = !this.isOpen;
        const modal = document.getElementById('file-manager-modal');
        modal.style.display = this.isOpen ? 'block' : 'none';

        if (this.isOpen) {
            this.refreshUserFilesList();
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            if (button.dataset.tab === tabName) {
                button.style.background = '#667eea';
                button.classList.add('active');
            } else {
                button.style.background = '#2a2a3e';
                button.classList.remove('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`${tabName}-tab`).style.display = 'block';
    }

    async downloadFile() {
        const url = document.getElementById('file-url-input').value.trim();
        const fileName = document.getElementById('file-name-input').value.trim();
        const categoryPath = document.getElementById('category-path-input').value.trim();

        if (!url) {
            alert('Please enter a file URL');
            return;
        }

        if (!fileName) {
            alert('Please enter a file name');
            return;
        }

        const progressDiv = document.getElementById('download-progress');
        progressDiv.style.display = 'block';
        progressDiv.textContent = 'Downloading...';

        try {
            // Download the file
            const filePath = await window.fileManager.downloadFile(url, fileName, (progress) => {
                progressDiv.textContent = `Downloading... ${progress}%`;
            });

            // Read the file content
            const content = await window.fileManager.readFile(filePath);

            // Add to metadata
            const fullPath = `${categoryPath}/${fileName}`;
            await window.metadataManager.addFile(fullPath, content);

            progressDiv.textContent = '✅ File downloaded and added successfully!';
            setTimeout(() => {
                progressDiv.style.display = 'none';
                this.refreshUserFilesList();
            }, 2000);

        } catch (error) {
            console.error('Error downloading file:', error);
            progressDiv.textContent = `❌ Error: ${error.message}`;
        }
    }

    async downloadGitHubRepo() {
        const repoUrl = document.getElementById('github-url-input').value.trim();
        const branch = document.getElementById('github-branch-input').value.trim() || 'main';

        if (!repoUrl) {
            alert('Please enter a GitHub repository URL');
            return;
        }

        const progressDiv = document.getElementById('github-progress');
        progressDiv.style.display = 'block';
        progressDiv.textContent = 'Downloading repository...';

        try {
            const zipPath = await window.fileManager.downloadGitHubRepo(repoUrl, branch);
            progressDiv.textContent = '✅ Repository downloaded! Note: Extract the ZIP manually.';
            progressDiv.innerHTML += `<br><small>Downloaded to: ${zipPath}</small>`;

        } catch (error) {
            console.error('Error downloading GitHub repo:', error);
            progressDiv.textContent = `❌ Error: ${error.message}`;
        }
    }

    async addLocalFile() {
        const content = document.getElementById('local-file-content').value.trim();
        const fileName = document.getElementById('local-file-name-input').value.trim();

        if (!content) {
            alert('Please paste some JavaScript code');
            return;
        }

        if (!fileName) {
            alert('Please enter a file name');
            return;
        }

        try {
            // Add to metadata
            const fullPath = `src/custom/${fileName}`;
            await window.metadataManager.addFile(fullPath, content);

            // Save to file system if Cordova is available
            if (window.fileManager.isCordova) {
                await window.fileManager.writeFile(fullPath, content);
            } else {
                // Store in localStorage as fallback
                const storageKey = `phaser4_custom_file_${fileName}`;
                localStorage.setItem(storageKey, content);
            }

            alert('✅ File added successfully!');
            document.getElementById('local-file-content').value = '';
            document.getElementById('local-file-name-input').value = '';
            this.refreshUserFilesList();

        } catch (error) {
            console.error('Error adding local file:', error);
            alert(`❌ Error: ${error.message}`);
        }
    }

    async refreshUserFilesList() {
        const listDiv = document.getElementById('user-files-list');

        try {
            await window.metadataManager.loadMetadata();
            const userFiles = window.metadataManager.getUserAddedExamples();

            if (userFiles.length === 0) {
                listDiv.innerHTML = '<p style="color: #666;">No user-added files yet.</p>';
                return;
            }

            listDiv.innerHTML = userFiles.map(file => `
                <div style="
                    background: #2a2a3e;
                    padding: 10px 15px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <div style="color: #fff; font-weight: 600;">${file.name}</div>
                        <div style="color: #888; font-size: 12px;">${file.path}</div>
                    </div>
                    <button class="delete-file-btn" data-path="${file.path}" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        padding: 5px 10px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Delete</button>
                </div>
            `).join('');

            // Add delete handlers
            listDiv.querySelectorAll('.delete-file-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this file?')) {
                        await window.metadataManager.removeFile(btn.dataset.path);
                        this.refreshUserFilesList();
                    }
                });
            });

        } catch (error) {
            console.error('Error loading user files:', error);
            listDiv.innerHTML = '<p style="color: #e74c3c;">Error loading files</p>';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fileManagerUI = new FileManagerUI();
    });
} else {
    window.fileManagerUI = new FileManagerUI();
}
