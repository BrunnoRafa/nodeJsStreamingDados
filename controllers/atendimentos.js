const Atendimentos = require('../models/atendimentos');

module.exports = app => {
  app.get('/atendimentos', (req, res) => {

    Atendimentos.lista()
      .then(resultados => res.json(resultados))
      .catch(erro => res.status(404).json(erro));
  });

  app.get('/atendimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    Atendimentos.buscaPorId(id)
      .then(atendimento => res.json(atendimento))
      .catch(erro => res.status(400).json(erro));
  });

  app.post('/atendimentos', (req, res) => {
    const atendimento = req.body;

    Atendimentos.adiciona(atendimento)
      .then(AtendimentoCadastrado => res.status(201).json(AtendimentoCadastrado))
      .catch(erro => res.status(400).json(erro))
  });

  app.patch('/atendimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const atendimento = req.body;

    Atendimentos.altera(id, atendimento)
      .then(atendimentoAlterado => res.json(atendimentoAlterado))
      .catch(erro => res.status(400).json(erro));
  });

  app.delete('/atendimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    Atendimentos.deleta(id)
      .then(AtendimentoDeletado => res.json(AtendimentoDeletado))
      .catch(erro => res.status(400).json(erro));
  });
}