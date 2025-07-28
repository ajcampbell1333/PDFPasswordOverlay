// Simple URL obfuscation utility
export const obfuscateUrl = (url) => {
  // Simple XOR encryption with a key
  const key = 'PDF_SECRET_KEY_2024';
  let encrypted = '';
  
  for (let i = 0; i < url.length; i++) {
    const charCode = url.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(charCode);
  }
  
  return btoa(encrypted);
};

export const deobfuscateUrl = (obfuscatedUrl) => {
  try {
    const encrypted = atob(obfuscatedUrl);
    const key = 'PDF_SECRET_KEY_2024';
    let decrypted = '';
    
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Failed to deobfuscate URL:', error);
    return null;
  }
};

// Alternative: Simple base64 encoding
export const encodeUrl = (url) => btoa(url);
export const decodeUrl = (encodedUrl) => atob(encodedUrl); 