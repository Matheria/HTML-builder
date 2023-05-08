const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

async function copyDir(dirname, copyFrom, copyTo) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      throw err;
    } 
  });
    
  fs.readdir(src, { withFileTypes: true }, (err, data) => {
    if (err) {
      throw err;
    }
    
    data.forEach(file => {
      if (file.isFile()) {  
        fs.copyFile(path.join(dirname, copyFrom, file.name), path.join(__dirname, copyTo, file.name), (err) => {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
}

copyDir(__dirname, 'files', 'files-copy');