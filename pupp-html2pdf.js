const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    const html = `<div class="overflow-y-auto p-4" dir="ltr">
  <code class="whitespace-pre! language-js"
    ><span
      ><span><span class="hljs-keyword">const</span></span
      ><span> puppeteer = </span
      ><span><span class="hljs-built_in">require</span></span
      ><span>(</span><span><span class="hljs-string">'puppeteer'</span></span
      ><span>); (</span><span><span class="hljs-keyword">async</span></span
      ><span> () =&gt; { </span
      ><span><span class="hljs-keyword">const</span></span
      ><span> browser = </span
      ><span><span class="hljs-keyword">await</span></span
      ><span> puppeteer.</span
      ><span><span class="hljs-title function_">launch</span></span
      ><span>(); </span><span><span class="hljs-keyword">const</span></span
      ><span> page = </span><span><span class="hljs-keyword">await</span></span
      ><span> browser.</span
      ><span><span class="hljs-title function_">newPage</span></span
      ><span>(); </span
      ><span
        ><span class="hljs-comment"
          >// 1. Navigate to the target website</span
        ></span
      ><span> </span><span><span class="hljs-keyword">await</span></span
      ><span> page.</span
      ><span><span class="hljs-title function_">goto</span></span
      ><span>(</span
      ><span><span class="hljs-string">'https://example.com'</span></span
      ><span>, { </span><span><span class="hljs-attr">waitUntil</span></span
      ><span>: </span
      ><span><span class="hljs-string">'networkidle0'</span></span
      ><span> }); </span
      ><span
        ><span class="hljs-comment"
          >// 2. Inject your custom CSS and DOM changes</span
        ></span
      ><span> </span><span><span class="hljs-keyword">await</span></span
      ><span> page.</span
      ><span><span class="hljs-title function_">addStyleTag</span></span
      ><span>({ </span><span><span class="hljs-attr">content</span></span
      ><span
        >:
        <span class="hljs-string"
          >  </span
        >
        }); </span
      ><span><span class="hljs-keyword">await</span></span
      ><span> page.evaluate(</span
      ><span><span class="hljs-function">() =&gt;</span></span
      ><span> { </span
      ><span
        ><span class="hljs-comment"
          >// Example DOM modification: Add a banner at the top</span
        ></span
      ><span> </span><span><span class="hljs-keyword">const</span></span
      ><span> banner = </span
      ><span><span class="hljs-variable language_">document</span></span
      ><span>.</span
      ><span><span class="hljs-title function_">createElement</span></span
      ><span>(</span><span><span class="hljs-string">'div'</span></span
      ><span>); banner.</span
      ><span><span class="hljs-property">className</span></span
      ><span> = </span><span><span class="hljs-string">'my-banner'</span></span
      ><span>; banner.</span
      ><span><span class="hljs-property">innerText</span></span
      ><span> = </span
      ><span
        ><span class="hljs-string"
          >'🚀 This PDF is modified by Navneet!'</span
        ></span
      ><span>; </span
      ><span><span class="hljs-variable language_">document</span></span
      ><span>.</span><span><span class="hljs-property">body</span></span
      ><span>.</span
      ><span><span class="hljs-title function_">prepend</span></span
      ><span>(banner); </span
      ><span><span class="hljs-comment">// Change the title text</span></span
      ><span> </span><span><span class="hljs-keyword">const</span></span
      ><span> h1 = </span
      ><span><span class="hljs-variable language_">document</span></span
      ><span>.</span
      ><span><span class="hljs-title function_">querySelector</span></span
      ><span>(</span><span><span class="hljs-string">'h1'</span></span
      ><span>); </span><span><span class="hljs-keyword">if</span></span
      ><span> (h1) h1.</span
      ><span><span class="hljs-property">innerText</span></span
      ><span> = </span
      ><span
        ><span class="hljs-string">'Modified by Puppeteer Bot ✨'</span></span
      ><span>; }); </span
      ><span><span class="hljs-comment">// 3. Generate and save PDF</span></span
      ><span> </span><span><span class="hljs-keyword">await</span></span
      ><span> page.</span
      ><span><span class="hljs-title function_">pdf</span></span
      ><span>({ </span><span><span class="hljs-attr">path</span></span
      ><span>: </span
      ><span><span class="hljs-string">'modified-website.pdf'</span></span
      ><span>, </span><span><span class="hljs-attr">format</span></span
      ><span>: </span><span><span class="hljs-string">'A4'</span></span
      ><span>, </span><span><span class="hljs-attr">printBackground</span></span
      ><span>: </span><span><span class="hljs-literal">true</span></span
      ><span> }); </span><span><span class="hljs-keyword">await</span></span
      ><span> browser.</span
      ><span><span class="hljs-title function_">close</span></span
      ><span>(); })();</span></span
    ></code
  >
</div>
`;
  const htmlContent = `
   <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      /* Add print-specific styles */
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
         
          body {
            font-family: monospace;
            padding: 40px;
            background: #fff;
          }

          code {
            white-space: pre-wrap;
            background: #f8f8f8;
            display: block;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #ddd;
            line-height: 1.6;
            overflow-x: auto;
          }

           code > span { display: block; }

          .hljs-keyword { color: #d73a49; font-weight: bold; }
          .hljs-string { color: #032f62; }
          .hljs-comment { color: #6a737d; font-style: italic; }
        
    </style>
  </head>
  <body>
  ${html}
  </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: 'output.pdf',
    format: 'A4',
    printBackground: true
  });

  await browser.close();
})();
