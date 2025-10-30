import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker - use local file to avoid CORS issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

// Detect iOS devices
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

function PdfViewer({ pdfUrl, jwtToken, serverHostedPDF, dockerServerUrl, pngMode }) {
  const useNativePDFViewer = !isIOS(); // Use native viewer on non-iOS devices
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const renderedPagesRef = useRef({}); // Cache for prerendered pages
  const isPreloadingRef = useRef(false); // Prevent multiple simultaneous preload loops
  
  // PNG progressive loading state
  const [loadedImages, setLoadedImages] = useState([0]); // Start with first image
  const [failedImages, setFailedImages] = useState(new Set());

  // Build the final URL with JWT token
  const finalUrl = serverHostedPDF && jwtToken 
    ? `${pdfUrl}?token=${jwtToken}`
    : pdfUrl;

  // Don't render until we have a token (if using server-hosted PDF)
  const shouldRender = serverHostedPDF ? jwtToken : true;
  
  // Check if we're in PNG mode
  const isPngMode = pngMode && pngMode.usePngMode && pngMode.pngFiles && pngMode.pngFiles.length > 0;

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (useNativePDFViewer || isPngMode) return; // Skip PDF.js loading for native viewer or PNG mode
    if (!shouldRender) return;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const loadingTask = pdfjsLib.getDocument(finalUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF');
        setLoading(false);
      }
    };

    loadPdf();
  }, [finalUrl, shouldRender]);

  // Preload remaining pages in background (re-runs on page change)
  useEffect(() => {
    if (useNativePDFViewer || isPngMode) return; // Skip for native viewer or PNG mode
    if (!pdfDoc || numPages === 0) return;
    if (isPreloadingRef.current) return; // Already preloading, don't start another loop

    // Check if all pages are already cached
    const allPagesCached = Object.keys(renderedPagesRef.current).length === numPages;
    if (allPagesCached) return;

    const preloadPages = async () => {
      isPreloadingRef.current = true;
      const container = containerRef.current;
      if (!container) {
        isPreloadingRef.current = false;
        return;
      }
      
      const containerWidth = container.clientWidth;

      // Preload all pages that aren't cached yet
      for (let i = 1; i <= numPages; i++) {
        if (renderedPagesRef.current[i]) {
          console.log(`Page ${i} already cached, skipping`);
          continue;
        }
        
        try {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale });
          
          // Create offscreen canvas for this page
          const offscreenCanvas = document.createElement('canvas');
          offscreenCanvas.width = scaledViewport.width;
          offscreenCanvas.height = scaledViewport.height;
          const offscreenContext = offscreenCanvas.getContext('2d');
          
          // Render to offscreen canvas
          await page.render({
            canvasContext: offscreenContext,
            viewport: scaledViewport
          }).promise;
          
          // Store the rendered image data
          renderedPagesRef.current[i] = {
            imageData: offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height),
            width: offscreenCanvas.width,
            height: offscreenCanvas.height
          };
          
          console.log(`Preloaded page ${i}/${numPages}`);
        } catch (err) {
          console.error(`Error preloading page ${i}:`, err);
        }
      }
      
      isPreloadingRef.current = false;
      console.log('All remaining pages preloaded!');
    };

    // Start preloading after a short delay to not block current page render
    const timeoutId = setTimeout(preloadPages, 100);
    return () => clearTimeout(timeoutId);
  }, [pdfDoc, numPages, pageNum]);

  useEffect(() => {
    if (useNativePDFViewer || isPngMode) return; // Skip for native viewer or PNG mode
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    const renderPage = async () => {
      try {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Check if we have a prerendered version
        if (renderedPagesRef.current[pageNum]) {
          const cached = renderedPagesRef.current[pageNum];
          canvas.width = cached.width;
          canvas.height = cached.height;
          context.putImageData(cached.imageData, 0, 0);
          console.log(`Using cached page ${pageNum}`);
          return;
        }
        
        // Otherwise render fresh
        const page = await pdfDoc.getPage(pageNum);
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        
        // Calculate scale to fit width
        const viewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        
        // Set canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // Render PDF page
        await page.render({
          canvasContext: context,
          viewport: scaledViewport
        }).promise;
        
        // Cache this page for future use
        renderedPagesRef.current[pageNum] = {
          imageData: context.getImageData(0, 0, canvas.width, canvas.height),
          width: canvas.width,
          height: canvas.height
        };
      } catch (err) {
        console.error('Error rendering page:', err);
      }
    };

    renderPage();
  }, [pdfDoc, pageNum, useNativePDFViewer]);

  // PNG loading handlers
  const handleImageLoad = (index) => {
    console.log(`PNG ${index + 1} loaded successfully`);
    // Load next image after this one finishes
    if (isPngMode && index + 1 < pngMode.pngFiles.length && !loadedImages.includes(index + 1)) {
      setLoadedImages(prev => [...prev, index + 1]);
    }
  };
  
  const handleImageError = (index) => {
    console.error(`PNG ${index + 1} failed to load`);
    setFailedImages(prev => new Set([...prev, index]));
    // Try to load next image even if this one failed
    if (isPngMode && index + 1 < pngMode.pngFiles.length && !loadedImages.includes(index + 1)) {
      setLoadedImages(prev => [...prev, index + 1]);
    }
  };

  // PNG Mode: Render high-res PNG images instead of PDF (for iOS with flag enabled)
  if (isPngMode) {
    
    return (
      <div className="pdf-background">
        <div className="png-viewer-container">
          {pngMode.pngFiles.map((filename, index) => {
            const shouldLoad = loadedImages.includes(index);
            const hasFailed = failedImages.has(index);
            
            if (!shouldLoad && !hasFailed) {
              // Placeholder for images not yet loaded
              return (
                <React.Fragment key={filename}>
                  <div 
                    className="png-page-placeholder"
                    style={{
                      minHeight: '100vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f5f5f5',
                      color: '#666'
                    }}
                  >
                    Loading page {index + 1}...
                  </div>
                  {index < pngMode.pngFiles.length - 1 && (
                    <div style={{
                      width: '100%',
                      height: '3px',
                      minHeight: '3px',
                      backgroundColor: 'black',
                      flexShrink: 0,
                      display: 'block'
                    }} />
                  )}
                </React.Fragment>
              );
            }
            
            if (hasFailed) {
              return (
                <React.Fragment key={filename}>
                  <div 
                    className="png-page-error"
                    style={{
                      minHeight: '100vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fee',
                      color: '#c33'
                    }}
                  >
                    Failed to load page {index + 1}
                  </div>
                  {index < pngMode.pngFiles.length - 1 && (
                    <div style={{
                      width: '100%',
                      height: '3px',
                      minHeight: '3px',
                      backgroundColor: 'black',
                      flexShrink: 0,
                      display: 'block'
                    }} />
                  )}
                </React.Fragment>
              );
            }
            
            return (
              <React.Fragment key={filename}>
                <img
                  src={`${dockerServerUrl}/png/${filename}?token=${jwtToken}`}
                  alt={`Page ${index + 1}`}
                  className="png-page"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
                {index < pngMode.pngFiles.length - 1 && (
                  <div className="png-page-separator" style={{
                    width: '100%',
                    height: '3px',
                    minHeight: '3px',
                    backgroundColor: 'black',
                    flexShrink: 0,
                    display: 'block'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Use native viewer for non-iOS devices (faster)
  if (useNativePDFViewer) {
    if (!shouldRender) {
      return (
        <div className="pdf-background">
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
        </div>
      );
    }

    return (
      <div className="pdf-background">
        <iframe
          src={finalUrl}
          title="Protected PDF Document"
          className="pdf-viewer"
        />
      </div>
    );
  }

  // PDF.js rendering for iOS devices
  if (!shouldRender) {
    return (
      <div className="pdf-background">
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
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pdf-background">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#666',
          fontSize: '18px'
        }}>
          Loading PDF...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-background">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#e74c3c',
          fontSize: '18px'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-background" ref={containerRef}>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />
        {numPages > 1 && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <button 
              onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
              disabled={pageNum === 1}
              style={{
                background: pageNum === 1 ? '#666' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '5px',
                cursor: pageNum === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span>Page {pageNum} of {numPages}</span>
            <button 
              onClick={() => setPageNum(prev => Math.min(numPages, prev + 1))}
              disabled={pageNum === numPages}
              style={{
                background: pageNum === numPages ? '#666' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '5px',
                cursor: pageNum === numPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfViewer; 