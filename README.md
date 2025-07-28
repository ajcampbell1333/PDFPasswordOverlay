# PDF Password Overlay React App

A simple React application that demonstrates a password-protected PDF viewer with an animated overlay interface.

## Features

- **Password Protection**: Simple string-based password validation
- **Animated Overlay**: Smooth upward wipe animation when correct password is entered
- **Modern UI**: Clean, responsive design with glassmorphism effects
- **Keyboard Support**: Press Enter key to submit password
- **Error Handling**: Visual feedback for incorrect passwords
- **Auto-focus**: Password field automatically focused on page load

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Technologies Used

- React 18
- CSS3 with modern features (backdrop-filter, gradients, animations)
- Create React App for project setup

## Browser Support

This app uses modern CSS features and may not work in older browsers. For production use, consider adding appropriate polyfills or fallbacks. 