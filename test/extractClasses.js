const fs = require('fs');

// Path to your HTML file
const filePath = 'allProgramming.txt';

// Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Regular expression to match words starting with 'hljs-'
const regex = /(?:^|\s|>|\b)hljs-\w+/g;
  const matches = data.match(regex);

  if (matches) {
    console.log('Found hljs- words:', matches);
  } else {
    console.log('No hljs- words found.');
  }
});
