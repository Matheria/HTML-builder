const fs = require('fs');
const path = require('path');
const { stdout } = process;

let readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), { encoding: 'utf-8' });

readStream.on('data', data => stdout.write(data));