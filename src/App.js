import React, { useState } from 'react';
import './App.css';
import PdfViewer from './components/PdfViewer';
import AuthenticatedPasswordOverlay from './components/AuthenticatedPasswordOverlay';
import { deobfuscateUrl } from './utils/urlObfuscator';

function App() {
  // Password constant - ONLY used for local PDF mode (serverHostedPDF = false)
  // When using server-hosted PDFs, password is validated server-side only
  const CORRECT_PASSWORD = ''; // Password validated server-side only (not stored client-side) // Password validated server-side only (not stored client-side) // Password validated server-side only (not stored client-side) // Password validated server-side only (not stored client-side) // Password validated server-side only (not stored client-side) // Change this to your desired password (local mode only)
  
  // Production subdirectory - change this if you deploy to a different subdirectory
  const productionSubdirectory = 'gigxr'; // Change this to your subdirectory name
  
  // Server configuration - set to true to use Docker server, false for local files
  const serverHostedPDF = true; // Change this to false for local PDF files
  
  // Docker server configuration
  const DOCKER_SERVER_URL = 'https://cover-letter-server-997121785405.us-west2.run.app'; // Change this to your Docker server URL
  const PDF_FILENAME = 'aj-campbell-gigxr-cover-letter-and-cv.pdf'; // Change this to your PDF filename
  
  // Obfuscated PDF URL - change this to your actual obfuscated PDF file URL
  // To generate a new obfuscated URL, use: node scripts/generateObfuscatedUrl.js "your-pdf-filename.pdf"
  const OBFUSCATED_PDF_URL = 'IyUrLz8gbSIhMg=='; // Encrypted with XOR key
  
  // State for JWT token and PNG mode
  const [jwtToken, setJwtToken] = useState(null);
  const [pngMode, setPngMode] = useState(null); // { usePngMode: true, pngFiles: [...] }
  
  // Deobfuscate the URL at runtime and handle subdirectory paths
  const deobfuscatedUrl = deobfuscateUrl(OBFUSCATED_PDF_URL);
  
  // Detect if we're on localhost and adjust paths accordingly
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Build the correct PDF URL based on environment and server configuration
  let PDF_URL;
  
  if (serverHostedPDF) {
    // Use Docker server for PDF serving - token will be added by PdfViewer
    PDF_URL = `${DOCKER_SERVER_URL}/pdf/${PDF_FILENAME}`;
  } else {
    // Use local file serving (original behavior)
    if (deobfuscatedUrl) {
      // If we have a deobfuscated URL, prepend the subdirectory path for production
      PDF_URL = isLocalhost ? `./${deobfuscatedUrl}` : `/${productionSubdirectory}/${deobfuscatedUrl}`;
    } else {
      // Fallback
      PDF_URL = isLocalhost ? './sample.pdf' : `/${productionSubdirectory}/sample.pdf`;
    }
  }

  return (
    <div className="App">
      <AuthenticatedPasswordOverlay 
        correctPassword={CORRECT_PASSWORD}
        serverHostedPDF={serverHostedPDF}
        dockerServerUrl={DOCKER_SERVER_URL}
        pdfFilename={PDF_FILENAME}
        onTokenReceived={setJwtToken}
        onPngModeReceived={setPngMode}
      >
        <PdfViewer 
          pdfUrl={PDF_URL} 
          jwtToken={jwtToken}
          serverHostedPDF={serverHostedPDF}
          dockerServerUrl={DOCKER_SERVER_URL}
          pngMode={pngMode}
        />
      </AuthenticatedPasswordOverlay>
    </div>
  );
}

export default App; 