const puppeteer = require('puppeteer');
const fs = require('fs').promises;

(async () => {
  // Configuration
  const url = 'https://chatgpt.com/share/682ee181-34fc-8005-b788-1ad2e2ff3945';
  const elementsToExtract = 'body'; // Extract entire body
  const classesToRemove = ['no-print', 'ad']; // Classes to remove
  const idsToRemove = ['page-header', 'thread-bottom-container', 'thread-bottom']; // IDs to remove
  const outputPath = 'modified-page.pdf';

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
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

    // Wait for dynamic content (e.g., ChatGPT conversation)
    console.log('Waiting for content to load...');
    await page.waitForSelector('body', { timeout: 30000 }).catch(() => {
      console.warn('Body selector not found; proceeding with available content.');
    });

    // Step 2: Copy elements and remove unwanted elements
    const extractedContent = await page.evaluate((selector, classesToRemove, idsToRemove) => {
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

      return container.innerHTML;
    }, elementsToExtract, classesToRemove, idsToRemove);

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
          pre, code {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 12px;
          }
          /* Basic syntax highlighting for code blocks */
          .keyword { color: #d73a49; font-weight: bold; }
          .string { color: #032f62; }
          .comment { color: #6a737d; font-style: italic; }
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
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
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