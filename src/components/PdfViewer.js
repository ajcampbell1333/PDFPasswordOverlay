import React from 'react';

function PdfViewer({ pdfUrl, jwtToken, serverHostedPDF }) {
  // Build the final URL with JWT token if using server-hosted PDF
  const finalUrl = serverHostedPDF && jwtToken 
    ? `${pdfUrl}?token=${jwtToken}`
    : pdfUrl;

  // Don't render iframe until we have a token (if using server-hosted PDF)
  const shouldRenderIframe = serverHostedPDF ? jwtToken : true;

  return (
    <div className="pdf-background">
      {shouldRenderIframe ? (
        <iframe
          src={finalUrl}
          title="Protected PDF Document"
          className="pdf-viewer"
          width="100%"
          height="100%"
        />
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#666',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
}

export default PdfViewer; 