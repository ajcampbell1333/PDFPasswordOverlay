// Helper script to generate obfuscated URLs
// Run this with: node scripts/generateObfuscatedUrl.js "your-pdf-filename.pdf"

const obfuscateUrl = (url) => {
  const key = 'PDF_SECRET_KEY_2024';
  let encrypted = '';
  
  for (let i = 0; i < url.length; i++) {
    const charCode = url.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(charCode);
  }
  
  return Buffer.from(encrypted).toString('base64');
};

const simpleEncode = (url) => {
  return Buffer.from(url).toString('base64');
};

// Get the URL from command line arguments
const originalUrl = process.argv[2];

if (!originalUrl) {
  console.log('Usage: node scripts/generateObfuscatedUrl.js "your-pdf-filename.pdf"');
  console.log('\nExamples:');
  console.log('  node scripts/generateObfuscatedUrl.js "document.pdf"');
  console.log('  node scripts/generateObfuscatedUrl.js "resume.pdf"');
  process.exit(1);
}

console.log('\n🔒 URL Obfuscation Results:\n');
console.log('Original URL:', originalUrl);
console.log('Simple Base64:', simpleEncode(originalUrl));
console.log('Encrypted:', obfuscateUrl(originalUrl));

console.log('\n📝 Copy the encrypted string to your App.js OBFUSCATED_PDF_URL constant\n'); 