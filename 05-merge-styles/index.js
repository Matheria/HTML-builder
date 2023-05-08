const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, data) => {
  if(err) {
    throw err;
  }

  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

  data.forEach(file => {
    const readStream = fs.createReadStream(path.join(path.join(__dirname, 'styles'), file.name));
    
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      readStream.on('data', function (chunk) {
        writeStream.write(chunk.toString() + '\n');
      });
    }
  });
});