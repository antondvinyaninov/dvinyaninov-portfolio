import fs from 'fs';
import { gzipSync, brotliCompressSync, constants } from 'zlib';
import path from 'path';

const cssFiles = [
  'dist/client/styles/global.css',
  'dist/client/styles/project-page.css',
];

for (const file of cssFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file);
    const originalSize = content.length;
    
    // Gzip
    const gzipped = gzipSync(content, { level: 9 });
    fs.writeFileSync(`${file}.gz`, gzipped);
    
    // Brotli
    const brotli = brotliCompressSync(content, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });
    fs.writeFileSync(`${file}.br`, brotli);
    
    console.log(`✓ ${path.basename(file)}:`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Gzip: ${(gzipped.length / 1024).toFixed(2)} KB (${((gzipped.length / originalSize) * 100).toFixed(1)}%)`);
    console.log(`  Brotli: ${(brotli.length / 1024).toFixed(2)} KB (${((brotli.length / originalSize) * 100).toFixed(1)}%)`);
  }
}

console.log('\n✓ CSS compression completed!');
