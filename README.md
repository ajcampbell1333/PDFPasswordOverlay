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

1. The app will load with a password overlay covering the "PDF content"
2. Enter the password: `secret123`
3. Press Enter or click the "Enter" button
4. Watch the overlay animate upward to reveal the protected content

## Customization

- **Change Password**: Modify the `CORRECT_PASSWORD` constant in `src/App.js`
- **Styling**: Edit `src/App.css` to customize colors, animations, and layout
- **Content**: Replace the placeholder PDF content with your actual PDF viewer component

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