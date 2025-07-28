import React from 'react';

function PdfViewer({ pdfUrl }) {
  return (
    <div className="pdf-background">
      <iframe
        src={pdfUrl}
        title="Protected PDF Document"
        className="pdf-viewer"
        width="100%"
        height="100%"
      />
    </div>
  );
}

export default PdfViewer; 