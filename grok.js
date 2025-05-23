const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs').promises; // For file permission checks

(async () => {
  // Your provided HTML (full snippet reconstructed from context)
//   const html = `
//     <div class="overflow-y-auto p-4" dir="ltr">
//       <code class="whitespace-pre! language-js">
//         <span><span class="hljs-keyword">const</span></span><span> puppeteer = </span><span><span class="hljs-built_in">require</span></span><span>(</span><span><span class="hljs-string">'puppeteer'</span></span><span>);</span>
//         <span>(</span><span><span class="hljs-keyword">async</span></span><span> () => {</span>
//         <span><span class="hljs-keyword">const</span></span><span> browser = </span><span><span class="hljs-keyword">await</span></span><span> puppeteer.</span><span><span class="hljs-title function_">launch</span></span><span>();</span>
//         <span><span class="hljs-keyword">const</span></span><span> page = </span><span><span class="hljs-keyword">await</span></span><span> browser.</span><span><span class="hljs-title function_">newPage</span></span><span>();</span>
//         <span><span class="hljs-comment">// 1. Navigate to the target website</span></span>
//         <span><span><span class="hljs-keyword">await</span></span><span> page.</span><span><span class="hljs-title function_">goto</span></span><span>(</span><span><span class="hljs-string">'https://example.com'</span></span><span>, { </span><span><span class="hljs-attr">waitUntil</span></span><span>: </span><span><span class="hljs-string">'networkidle0'</span></span><span> });</span>
//         <span><span class="hljs-comment">// 2. Inject your custom CSS and DOM changes</span></span>
//         <span><span><span class="hljs-keyword">await</span></span><span> page.</span><span><span class="hljs-title function_">addStyleTag</span></span><span>({ </span><span><span class="hljs-attr">content</span></span><span>: </span><span><span class="hljs-string">''</span></span><span> });</span>
//         <span><span><span class="hljs-keyword">await</span></span><span> page.</span><span><span class="hljs-title function_">evaluate</span></span><span>(</span><span><span class="hljs-function">() =></span></span><span> {</span>
//         <span><span class="hljs-comment">// Example DOM modification: Add a banner at the top</span></span>
//         <span><span><span class="hljs-keyword">const</span></span><span> banner = </span><span><span class="hljs-variable language_">document</span></span><span>.</span><span><span class="hljs-title function_">createElement</span></span><span>(</span><span><span class="hljs-string">'div'</span></span><span>);</span>
//         <span>banner.</span><span><span class="hljs-property">className</span></span><span> = </span><span><span class="hljs-string">'my-banner'</span></span><span>;</span>
//         <span>banner.</span><span><span class="hljs-property">innerText</span></span><span> = </span><span><span class="hljs-string">'🚀 This PDF is modified by Navneet!'</span></span><span>;</span>
//         <span><span><span class="hljs-variable language_">document</span></span><span>.</span><span><span class="hljs-property">body</span></span><span>.</span><span><span class="hljs-title function_">prepend</span></span><span>(banner);</span>
//         <span><span class="hljs-comment">// Change the title text</span></span>
//         <span><span><span class="hljs-keyword">const</span></span><span> h1 = </span><span><span class="hljs-variable language_">document</span></span><span>.</span><span><span class="hljs-title function_">querySelector</span></span><span>(</span><span><span class="hljs-string">'h1'</span></span><span>);</span>
//         <span><span><span class="hljs-keyword">if</span></span><span> (h1) h1.</span><span><span class="hljs-property">innerText</span></span><span> = </span><span><span class="hljs-string">'Modified by Puppeteer Bot ✨'</span></span><span>;</span>
//         <span>});</span>
//         <span><span class="hljs-comment">// 3. Generate and save PDF</span></span>
//         <span><span><span class="hljs-keyword">await</span></span><span> page.</span><span><span class="hljs-title function_">pdf</span></span><span>({ </span><span><span class="hljs-attr">path</span></span><span>: </span><span><span class="hljs-string">'modified-website.pdf'</span></span><span>, </span><span><span class="hljs-attr">format</span></span><span>: </span><span><span class="hljs-string">'A4'</span></span><span>, </span><span><span class="hljs-attr">printBackground</span></span><span>: </span><span><span class="hljs-literal">true</span></span><span> });</span>
//         <span><span><span class="hljs-keyword">await</span></span><span> browser.</span><span><span class="hljs-title function_">close</span></span><span>();</span>
//         <span>})();</span>
//       </code>
//     </div>
//   `;
const html =``;
  // Step 1: Extract the JavaScript code using Cheerio
  try {
    const $ = cheerio.load(html);
    const extractedCode = $('code').text().trim();
    console.log('Extracted Code:', extractedCode);

    // Step 2: Create HTML with embedded CSS for syntax highlighting
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Code PDF</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            padding: 40px;
            background: #fff;
          }
          pre {
            background: #f8f8f8;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #ddd;
            line-height: 1.6;
            overflow-x: auto;
            white-space: pre-wrap;
          }
          /* Basic syntax highlighting */
          .keyword { color: #d73a49; font-weight: bold; }
          .string { color: #032f62; }
          .comment { color: #6a737d; font-style: italic; }
          .function { color: #6f42c1; }
          .punctuation { color: #24292e; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <pre><code>${highlightCode(extractedCode)}</code></pre>
      </body>
      </html>
    `;

    // Step 3: Generate PDF with Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set HTML content
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Ensure output directory is writable
    const outputPath = 'output.pdf';
    try {
      await fs.access(__dirname, fs.constants.W_OK);
    } catch (err) {
      console.error('Cannot write to output directory:', err);
      await browser.close();
      return;
    }

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', right: '30px', bottom: '30px', left: '30px' }
    });

    console.log(`PDF generated successfully at ${outputPath}`);
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();

// Basic syntax highlighting function
function highlightCode(code) {
  // Simple regex-based highlighting for PDF rendering
  return code
    .replace(/\b(const|let|async|await|function|if)\b/g, '<span class="keyword">$1</span>')
    .replace(/('.*?')/g, '<span class="string">$1</span>')
    .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
    .replace(/\b(goto|launch|newPage|pdf|evaluate)\b/g, '<span class="function">$1</span>')
    .replace(/[{}();,.]/g, '<span class="punctuation">$&</span>');
}