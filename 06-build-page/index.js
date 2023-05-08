const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

async function createProjectFolder() {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
    if (err) {
      throw err;
    }
  });
}

async function createHtml() {
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const writeStream = fs.createWriteStream(path.join(path.join(__dirname, 'project-dist'), 'index.html'));
                      
  let template='';

  readStream.on('data', data => {
    template = data.toString();

    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, files) => {
      if(err) {
        throw new Error('Error');
      }
    
      files.forEach((file, index) => {
        if (file.isFile() && path.parse(file.name).ext === '.html') {
          const readFile = fs.createReadStream(path.join(__dirname, 'components', file.name));
          const fileName = path.parse(file.name).name;
          const name = `{{${fileName}}}`;

          readFile.on('data', data => {
            template = template.replace(name, data.toString());
            if (index === files.length - 1) {
              writeStream.write(template);
            }
          });
        }
      });
    });
  });
}

async function createCss() {
  try {
    const data = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    const writeCss = fs.createWriteStream(path.join(path.join(__dirname, 'project-dist'), 'style.css'));

    data.forEach(file => {
      const readCss = fs.createReadStream(path.join(__dirname, 'styles', file.name));

      if (file.isFile() && path.parse(file.name).ext === '.css') {
        readCss.on('data', function (chunk) {
          writeCss.write(chunk.toString() + '\n');
        });
      } 
    });
  } catch {
    console.log('Error');
  }
}

async function copyProjectFiles(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });

  try {
    const data = await fsPromises.readdir(src, { withFileTypes: true });
    
    data.forEach(file => {
      if (!file.isDirectory()) {
        fsPromises.copyFile(path.join(src, file.name), path.join(dest, file.name));
      } else {
        copyProjectFiles(path.join(src, file.name), path.join(dest, file.name));
      }
    });
  } catch {
    console.log('Error');
  }
}

async function createPage() {
  await createProjectFolder();
  createHtml();
  createCss();
  copyProjectFiles(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}
  
createPage();
