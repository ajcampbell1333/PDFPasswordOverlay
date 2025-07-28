import React from 'react';
import './App.css';
import PdfViewer from './components/PdfViewer';
import AuthenticatedPasswordOverlay from './components/AuthenticatedPasswordOverlay';
import { deobfuscateUrl } from './utils/urlObfuscator';

function App() {
  // Simple password constant - you can change this to any string you want
  const CORRECT_PASSWORD = 'ed'; // would auth server-side in production
  
  // Obfuscated PDF URL - change this to your actual obfuscated PDF file URL
  // To generate a new obfuscated URL, use: node scripts/generateObfuscatedUrl.js "your-pdf-filename.pdf"
  const OBFUSCATED_PDF_URL = 'MS5rPDIoMzAgODNmKDg8WllcVX0nKSk2N24+ICArLjd0PlxUH1cmajY7NQ=='; // Encrypted with XOR key
  
  // Deobfuscate the URL at runtime
  const PDF_URL = deobfuscateUrl(OBFUSCATED_PDF_URL) || '/sample.pdf';

  return (
    <div className="App">
      <AuthenticatedPasswordOverlay correctPassword={CORRECT_PASSWORD}>
        <PdfViewer pdfUrl={PDF_URL} />
      </AuthenticatedPasswordOverlay>
    </div>
  );
}

export default App; 