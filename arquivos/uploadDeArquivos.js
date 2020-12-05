const fs = require('fs');
const path = require('path');

module.exports = (caminho, nomeArquivo, callbackImagemCriada) => {
  const tiposValidos = ['jpg', 'png', 'jpeg'];
  const tipo = path.extname(caminho);
  const tipoEValido = tiposValidos.indexOf(tipo.substring(1)) !== -1;

  if (!tipoEValido) {
    const erro = 'Tipo inválido';
    callbackImagemCriada(erro);
    console.log('Erro. Tipo inválido');
  } else {
    const novoCaminho = `./assets/img/${nomeArquivo}${tipo}`;

    fs.createReadStream(caminho)
      .pipe(fs.createWriteStream(novoCaminho))
      .on('finish', () => callbackImagemCriada(false, novoCaminho));
  }
};
