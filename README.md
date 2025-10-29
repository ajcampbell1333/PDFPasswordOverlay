# PDF Password Overlay React App

A simple React application that demonstrates a password-protected PDF viewer with an animated overlay interface. This app can serve PDFs locally or integrate with a secure Docker-based PDF server for enhanced security.

## Related Project

This app works seamlessly with the [PDF Password Server](https://github.com/ajcampbell1333/PDFPasswordServer) for secure, server-side PDF hosting with JWT authentication. See the **Server Integration** section below for setup instructions.

## Features

- **Password Protection**: Simple string-based password validation
- **Animated Overlay**: Smooth upward wipe animation when correct password is entered
- **Modern UI**: Clean, responsive design with glassmorphism effects
- **Keyboard Support**: Press Enter key to submit password
- **Error Handling**: Visual feedback for incorrect passwords
- **Auto-focus**: Password field automatically focused on page load
- **Dual Mode**: Serve PDFs locally or via secure Docker server
- **JWT Authentication**: Integrates with server-side authentication for enhanced security

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the PDF.js worker file (required for PDF rendering):
```bash
# Windows PowerShell:
Copy-Item "node_modules\pdfjs-dist\build\pdf.worker.mjs" -Destination "public\pdf.worker.mjs"

# macOS/Linux:
cp node_modules/pdfjs-dist/build/pdf.worker.mjs public/pdf.worker.mjs
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**Note:** The PDF.js worker file is excluded from git. You must copy it after running `npm install` on any fresh clone or new setup.

## How to Use

1. The app will load with a password overlay covering the PDF content
2. Enter the password: `[YOUR_PASSWORD_HERE]`
3. Press Enter or click the "Enter" button
4. Watch the overlay animate upward to reveal the protected PDF

## Customization

### Setting Your Own Password
- **Change Password**: Modify the `CORRECT_PASSWORD` constant in `src/App.js`

### Adding Your Own PDF File

1. **Place your PDF in the public folder**:
   ```bash
   # Copy your PDF file to the public directory
   cp your-document.pdf public/
   ```

2. **Generate an obfuscated URL**:
   ```bash
   # Run the helper script to create an obfuscated URL
   node scripts/generateObfuscatedUrl.js "your-document.pdf"
   ```

3. **Update App.js with the obfuscated URL**:
   ```javascript
   // In src/App.js, replace the OBFUSCATED_PDF_URL constant
   const OBFUSCATED_PDF_URL = 'YOUR_GENERATED_OBFUSCATED_STRING_HERE';
   ```

4. **Restart the development server**:
   ```bash
   npm start
   ```

### Example Workflow
```bash
# 1. Add your PDF to public folder
cp resume.pdf public/

# 2. Generate obfuscated URL
node scripts/generateObfuscatedUrl.js "resume.pdf"

# 3. Copy the encrypted string and update src/App.js
# 4. Restart the app
npm start
```

### Other Customizations
- **Styling**: Edit `src/App.css` to customize colors, animations, and layout
- **Security**: Modify the encryption key in `src/utils/urlObfuscator.js` for enhanced security

### Configuring Production Subdirectory

If deploying to a subdirectory (e.g., `https://yourdomain.com/my-app/`):

1. **Update `productionSubdirectory` in `src/App.js`**:
   ```javascript
   const productionSubdirectory = 'my-app'; // Change to your subdirectory name
   ```

2. **Update `homepage` in `package.json`**:
   ```json
   "homepage": "/my-app/"
   ```

3. **Rebuild the app**:
   ```bash
   npm run build
   ```

## Server Integration

### Option 1: Local PDF Files (Default)

Set `serverHostedPDF = false` in `src/App.js` to serve PDFs from the `public/` folder.

### Option 2: Docker-Hosted PDFs (Recommended for Production)

For enhanced security, use the [PDF Password Server](https://github.com/ajcampbell1333/PDFPasswordServer):

1. **Deploy the PDF Password Server** (see server repo for instructions)

2. **Configure the React app in `src/App.js`**:
   ```javascript
   const serverHostedPDF = true;
   const DOCKER_SERVER_URL = 'https://your-cloud-run-service-url.run.app';
   const PDF_FILENAME = 'your-document.pdf';
   ```

3. **Rebuild and deploy**:
   ```bash
   npm run build
   ```

The app will automatically:
- Authenticate with the server using the password
- Receive a JWT token
- Load the PDF with the token for secure access

## Deployment

### Deploy to Staging

1. **Configure for staging** in `src/App.js`:
   ```javascript
   const productionSubdirectory = 'my-app/stage';
   ```

2. **Update `package.json`**:
   ```json
   "homepage": "/my-app/stage/"
   ```

3. **Build for staging**:
   ```bash
   npm run build
   ```

4. **Upload** the `build/` folder contents to your staging subdirectory on your web server (e.g., cPanel, FTP, etc.)

### Deploy to Production

1. **Configure for production** in `src/App.js`:
   ```javascript
   const productionSubdirectory = 'my-app';
   const CORRECT_PASSWORD = 'your-production-password';
   const DOCKER_SERVER_URL = 'https://your-production-server.run.app';
   const PDF_FILENAME = 'your-production-document.pdf';
   ```

2. **Update `package.json`**:
   ```json
   "homepage": "/my-app/"
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Upload** the `build/` folder contents to your production directory

### Deploy to Root Domain

If deploying to the root of your domain (e.g., `https://yourdomain.com/`):

1. **Remove subdirectory references** in `src/App.js`:
   ```javascript
   const productionSubdirectory = '';
   ```

2. **Remove `homepage` from `package.json`** or set it to `"/"`:
   ```json
   "homepage": "/"
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run build:localhost` - Builds with relative paths for local testing
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Technologies Used

- React 18
- PDF.js (Mozilla's PDF rendering library)
- CSS3 with modern features (backdrop-filter, gradients, animations)
- Create React App for project setup
- JWT Authentication (when using Docker server)
- Fetch API for server communication

## Browser Support

This app uses PDF.js for PDF rendering, which provides excellent cross-browser support including:
- ✅ Chrome/Edge (desktop and mobile)
- ✅ Firefox (desktop and mobile)
- ✅ Safari (desktop and iOS/iPadOS)
- ✅ All modern browsers

**Note:** The app uses modern CSS features (backdrop-filter, CSS Grid, Flexbox) which work in all modern browsers.

## Security Considerations

### Local PDF Serving
- PDFs are publicly accessible in the `public/` folder
- URL obfuscation provides minimal security (client-side only)
- Suitable for low-security use cases

### Server-Hosted PDFs (Recommended)
- PDFs are stored securely on the server
- JWT authentication with 1-hour expiration
- Rate limiting prevents abuse
- CORS protection limits access to your domain
- Suitable for sensitive documents

For maximum security, always use the [PDF Password Server](https://github.com/ajcampbell1333/PDFPasswordServer).

## Troubleshooting

### Blank White Screen After Deployment
- Ensure `homepage` in `package.json` matches your deployment path
- Check browser console for 404 errors on CSS/JS files
- Verify `productionSubdirectory` in `App.js` matches your server path

### PDF Not Loading
- Check that the PDF filename matches exactly (case-sensitive)
- Verify the Docker server URL is correct and accessible
- Check browser console for CORS or authentication errors
- Ensure the password matches between client and server
- **If you see "Failed to load PDF" or worker errors**: Make sure you copied the PDF.js worker file (see Installation step 2)

### Clear Browser Cache
After deployment, users may need to clear their cache:
- Chrome/Edge: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Firefox: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Safari: `Cmd+Option+E` (Mac)

Or use hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac) 