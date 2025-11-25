# Phaser 4 Sandbox - Cordova APK Build Guide

This document explains how to build an Android APK for the Phaser 4 Sandbox with file management capabilities.

## Features

The Cordova-enabled APK includes:

- **File Download**: Download JavaScript files from any URL
- **GitHub Repository Download**: Download entire GitHub repositories
- **Local File Creation**: Create and add custom Phaser examples
- **Metadata Management**: Automatically tracks and lists all added scenes
- **File Editing**: Create, edit, and delete custom examples

## GitHub Actions Workflow

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yaml`) that automatically builds the APK.

### Automatic Build Triggers

The workflow runs automatically on:
- Push to `main` branch
- Push to any `claude/**` branch
- Pull requests to `main`
- Manual trigger via GitHub Actions UI

### Manual Build

To manually trigger a build:
1. Go to the "Actions" tab in your GitHub repository
2. Select "Build Android APK" workflow
3. Click "Run workflow"

### APK Artifacts

After a successful build, the APK will be available:
- As a downloadable artifact in the GitHub Actions run (retained for 30 days)
- As a release asset if you push a git tag

### Signing the APK (Optional)

To sign your APK for production release, add these secrets to your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `ANDROID_KEYSTORE_BASE64`: Your keystore file encoded in base64
   - `ANDROID_KEY_ALIAS`: Your key alias
   - `ANDROID_KEYSTORE_PASSWORD`: Your keystore password
   - `ANDROID_KEY_PASSWORD`: Your key password

To create a keystore and encode it:
```bash
# Create keystore
keytool -genkey -v -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Encode to base64
base64 release.keystore | tr -d '\n' > release.keystore.base64
```

## Local Build

To build the APK locally:

### Prerequisites

- Node.js (v18 or later)
- Java JDK 17
- Android SDK
- Cordova CLI: `npm install -g cordova`

### Build Steps

1. **Initialize Cordova** (if not already done):
   ```bash
   cordova platform add android
   ```

2. **Install Plugins**:
   ```bash
   cordova plugin add cordova-plugin-file
   cordova plugin add cordova-plugin-file-transfer
   cordova plugin add cordova-plugin-network-information
   cordova plugin add cordova-plugin-inappbrowser
   cordova plugin add cordova-plugin-device
   cordova plugin add cordova-plugin-whitelist
   ```

3. **Build the APK**:
   ```bash
   cordova build android --release
   ```

4. **Find the APK**:
   The APK will be located at:
   ```
   platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
   ```

## File Management Features

### Using the File Manager

1. **Open File Manager**: Click the "📁 Manage Files" button in the bottom-right corner

2. **Download from URL**:
   - Enter the file URL
   - Specify a filename (e.g., `my-example.js`)
   - Choose a category path (default: `src/custom`)
   - Click "Download & Add to Examples"

3. **Download GitHub Repository**:
   - Enter the GitHub repository URL (e.g., `https://github.com/user/repo`)
   - Specify the branch (default: `main`)
   - Click "Download GitHub Repo"
   - Note: ZIP extraction requires manual handling or additional plugins

4. **Create Local File**:
   - Paste your Phaser scene JavaScript code
   - Enter a filename
   - Click "Add to Examples"

### Metadata System

The app automatically:
- Detects Phaser.Scene classes in JavaScript files
- Extracts scene names and configuration
- Updates the examples list in real-time
- Stores custom files in localStorage (web) or file system (Cordova)

### Scene Detection

When you add a file, the metadata manager automatically parses it to detect:
- Class names extending `Phaser.Scene`
- Scene configuration objects
- Descriptive comments for scene names

Example scene structure:
```javascript
class MyExample extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        // Load assets
    }

    create() {
        // Create game objects
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyExample
};

const game = new Phaser.Game(config);
```

## Cordova Plugins

The app uses the following Cordova plugins:

- **cordova-plugin-file**: File system access and manipulation
- **cordova-plugin-file-transfer**: Download files from URLs
- **cordova-plugin-network-information**: Check network connectivity
- **cordova-plugin-inappbrowser**: Open URLs in a browser
- **cordova-plugin-device**: Get device information
- **cordova-plugin-whitelist**: Control access to external resources

## Permissions

The app requests the following Android permissions:

- `INTERNET`: Download files from URLs
- `ACCESS_NETWORK_STATE`: Check network connectivity
- `READ_EXTERNAL_STORAGE`: Read files from device storage
- `WRITE_EXTERNAL_STORAGE`: Write files to device storage
- `READ_MEDIA_IMAGES/VIDEO/AUDIO`: Android 13+ granular media permissions

## Troubleshooting

### Build Fails

- Ensure all prerequisites are installed
- Check that Android SDK is properly configured
- Verify that `config.xml` is in the project root

### File Operations Don't Work

- Check that the app has storage permissions
- Verify that Cordova is initialized (`deviceready` event)
- Check browser console for errors

### APK Won't Install

- Enable "Unknown Sources" in Android settings
- Check that the APK is signed (for production)
- Verify minimum SDK version compatibility (API 24+)

## API Reference

### FileManager

Global instance: `window.fileManager`

Methods:
- `downloadFile(url, fileName, progressCallback)`: Download a file from URL
- `downloadGitHubRepo(repoUrl, branch)`: Download GitHub repository
- `readFile(filePath)`: Read file contents
- `writeFile(filePath, content, append)`: Write content to file
- `listFiles(dirPath)`: List files in directory
- `deleteFile(filePath)`: Delete a file

### MetadataManager

Global instance: `window.metadataManager`

Methods:
- `loadMetadata()`: Load examples metadata
- `addFile(filePath, content, displayName)`: Add file to metadata
- `removeFile(filePath)`: Remove file from metadata
- `searchExamples(query)`: Search for examples
- `getUserAddedExamples()`: Get all user-added files
- `exportMetadata()`: Export metadata as JSON
- `importMetadata(jsonString)`: Import metadata from JSON

## Support

For issues or questions:
- Check the Phaser documentation: https://phaser.io
- Visit Phaser forums: https://phaser.discourse.group
- Report bugs on GitHub Issues
