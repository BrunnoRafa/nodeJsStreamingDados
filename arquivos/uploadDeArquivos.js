const fs = require('fs');

fs.createReadStream('./assets/img/autumn-forest.jpg')
  .pipe(fs.createWriteStream('./assets/img/autumn-forest-2.jpg'))
  .on('finish', () => console.log('imagem escrita com sucesso'));