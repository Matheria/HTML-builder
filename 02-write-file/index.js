const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Enter your text here:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Thank you');
    exit();
  }
  writeStream.write(data);
});

process.on('SIGINT', () => {
  stdout.write('Thank you!');
  exit();    
});