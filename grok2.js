const puppeteer = require('puppeteer');
const fs = require('fs').promises;

(async () => {
  // Configuration
  const url = 'https://chatgpt.com/share/682f176d-dd20-8005-a84f-3a9982154964';
  const elementsToExtract = 'main'; // Extract entire body
  const classesToRemove = ['no-print', 'ad', 'sr-only']; // Classes to remove
  const idsToRemove = ['page-header', 'thread-bottom-container', 'thread-bottom']; // IDs to remove
  const outputPath = './outputs/modified-page.pdf';

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: 'false', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Set user agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Step 1: Navigate to the website
    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    } catch (error) {
      console.warn('Initial navigation failed, retrying with longer timeout...');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    }

     // Wait for images to load
    console.log('Waiting for images to load...');
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          });
        })
      );
    }).catch(err => console.warn('Image wait failed:', err.message));

    // Wait for dynamic content (e.g., ChatGPT conversation)
    console.log('Waiting for content to load...');
    await page.waitForSelector('body', { timeout: 30000 }).catch(() => {
      console.warn('Body selector not found; proceeding with available content.');
    });


    // Debug: Log all image URLs
    const imageUrls = await page.evaluate(() => Array.from(document.querySelectorAll('img')).map(img => img.src));
    console.log('Image URLs found:', imageUrls);

    // Step 2: Copy elements and remove unwanted elements
    const extractedContent = await page.evaluate((selector, classesToRemove, idsToRemove, baseUrl) => {
      // Extract the desired element(s)
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return '<p>Error: No elements found for selector</p>';

      // Clone content to avoid modifying the live DOM
      const container = document.createElement('div');
      elements.forEach(el => container.appendChild(el.cloneNode(true)));

      // Remove elements with specified classes
      classesToRemove.forEach(cls => {
        container.querySelectorAll(`.${cls}`).forEach(el => el.remove());
      });

      // Remove elements with specified IDs
      idsToRemove.forEach(id => {
        const el = container.querySelector(`#${id}`);
        if (el) el.remove();
      });

    container.querySelectorAll('button, h1, h2, h3, h4, h5, h6')
  .forEach(element => element.remove());


// Deduplicate images based on src
      const seenSrcs = new Set();
      container.querySelectorAll('img').forEach(img => {
        if (!img.src) return;
        if (seenSrcs.has(img.src)) {
          img.remove(); // Remove duplicate image
        } else {
          seenSrcs.add(img.src);
        }
      });

      // Convert relative image URLs to absolute
      container.querySelectorAll('img').forEach(img => {
        if (img.src && !img.src.startsWith('http')) {
          img.src = new URL(img.src, baseUrl).href;
        }
      });
      // Preserve background images
      container.querySelectorAll('[style*="background-image"]').forEach(el => {
        const style = el.getAttribute('style');
        const match = style.match(/url\(['"]?(.+?)['"]?\)/);
        if (match && match[1] && !match[1].startsWith('http')) {
          const absoluteUrl = new URL(match[1], baseUrl).href;
          el.style.backgroundImage = `url('${absoluteUrl}')`;
        }
      });

      return container.innerHTML;
    }, elementsToExtract, classesToRemove, idsToRemove, url);

    // Log extracted content for debugging
    console.log('Extracted content length:', extractedContent.length);
    if (extractedContent.includes('Error')) {
      console.warn('Extraction failed:', extractedContent);
    }

    // Step 3: Modify the content
    const modifiedHtml = await page.evaluate((content) => {
      // Create a temporary container for modifications
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      // Modifications:
      // 1. Add a banner
      const banner = document.createElement('div');
      banner.style.cssText = 'background: #007bff; color: white; padding: 10px; text-align: center; font-family: Arial;';
      banner.innerText = 'Modified by Puppeteer Bot ✨';
      tempDiv.prepend(banner);

      // 2. Change text of all h1 elements
      tempDiv.querySelectorAll('h1').forEach(h1 => {
        h1.innerText = 'Modified Title';
      });

      return tempDiv.innerHTML;
    }, extractedContent);

     console.log("Modified HTML:", modifiedHtml);

    // Step 4: Create HTML for PDF with styles
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Modified Page PDF</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            background: #fff;
            line-height: 1.6;
          }
          
            .whitespace-pre-wrap{
            background:rgb(149, 255, 255);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
            white-space: pre-wrap;
            }
           /* Basic syntax highlighting */
          /* Base styles for code blocks to ensure proper formatting */
pre {
  background: #f8f8f8; /* Light gray background for code blocks */
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  white-space: pre-wrap; /* Preserve whitespace and wrap lines */
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow-x: auto; /* Allow horizontal scrolling for long lines */
}

code {
  font-family: 'Courier New', monospace;
  background: #f8f8f8; /* No extra background inside pre */
}

/* Highlight.js syntax highlighting styles */
.hljs-meta {
  color: #6a737d; /* Gray for meta directives (e.g., #include, @import) */
  font-style: italic; /* Italic to distinguish from other tokens */
}

.hljs-keyword {
  color: #d73a49; /* Red for keywords (e.g., const, function, if) */
  font-weight: bold; /* Bold to emphasize control structures */
}

.hljs-string {
  color: #032f62; /* Dark blue for strings (e.g., "hello") */
}

.hljs-type {
  color: #22863a; /* Green for types (e.g., int, String) */
  font-weight: 600; /* Slightly bold for clarity */
}

.hljs-title {
  color: #6f42c1; /* Purple for titles (e.g., function/class names) */
  font-weight: 600; /* Slightly bold for prominence */
}

.hljs-params {
  color: #e36209; /* Orange for function parameters */
}

.hljs-built_in {
  color: #005cc5; /* Bright blue for built-in functions/objects (e.g., console, require) */
}

.hljs-number {
  color: #005cc5; /* Blue for numbers (e.g., 42, 3.14) */
}

.hljs-variable {
  color: #24292e; /* Dark gray for variables (e.g., myVar) */
}

.hljs-operator {
  color: #d73a49; /* Red for operators (e.g., +, -, =) */
}

.hljs-function {
  color: #6f42c1; /* Purple for function calls, matching hljs-title */
}

/* Ensure colors are preserved in print (for Puppeteer PDFs) */
@media print {
  body {
    -webkit-print-color-adjust: exact; /* Preserve background and text colors */
  }
  pre {
    background: #f8f8f8 !important;
    border: 1px solid #ddd !important;
  }
  .hljs-meta,
  .hljs-keyword,
  .hljs-string,
  .hljs-type,
  .hljs-title,
  .hljs-params,
  .hljs-built_in,
  .hljs-number,
  .hljs-variable,
  .hljs-operator,
  .hljs-function {
    -webkit-print-color-adjust: exact;
  }
}
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${modifiedHtml}
      </body>
      </html>
    `;

    // Step 5: Generate PDF
    console.log('Generating PDF...');
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Check write permissions
    try {
      await fs.access(__dirname, fs.constants.W_OK);
    } catch (err) {
      throw new Error(`Cannot write to output directory: ${err.message}`);
    }

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '50px', right: '30px', bottom: '30px', left: '40px' },
      preferCSSPageSize: true
    });

    console.log(`PDF generated successfully at ${outputPath}`);
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
    if (error.name === 'TimeoutError') {
      console.error('Page load timed out. Try increasing timeout, checking URL, or handling authentication.');
    }
    process.exit(1);
  }
})();
