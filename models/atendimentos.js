const moment = require('moment');
const axios = require('axios');
const conexao = require('../infraestrutura/conexao');

class Atendimento {

  adiciona(atendimento, res) {
    const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

    const dataValida = moment(data).isSameOrAfter(dataCriacao);
    const cpfValido = atendimento.cliente.length === 11;

    const validacoes = [
      {
        nome: 'data',
        valido: dataValida,
        mensagem: 'Data deve ser maior ou igual a data atual'
      },
      {
        nome: 'cliente',
        valido: cpfValido,
        mensagem: 'CPF do Cliente invalido'
      }
    ];

    const erros = validacoes.filter(campo => !campo.valido);
    const existemErros = erros.length;

    if (existemErros) {
      res.status(400).json(erros);
    } else {
      const atendimentoDatado = { ...atendimento, dataCriacao, data }

      const sql = 'INSERT INTO Atendimentos SET ?';

      conexao.query(sql, atendimentoDatado, (erro, resultado) => {
        if (erro) {
          res.status(400).json(erro);
        } else {
          res.status(201).json(atendimento);
        }
      });
    }
  }

  lista(res) {
    const sql = 'SELECT * FROM Atendimentos';

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        res.status(200).json(resultados);
      }
    })
  }

  buscaPorId(id, res) {
    const sql = `SELECT * FROM Atendimentos where id=${id}`;

    conexao.query(sql, async (erro, resultado) => {
      const atendimento = resultado[0];
      const cpf = atendimento.cliente;

      if (erro) {
        res.status(400).json(erro);
      } else {
        const { data } = await axios.get(`http://localhost:8082/${cpf}`);
        atendimento.cliente = data;
        res.status(200).json(atendimento);
      }
    })
  }

  altera(id, valores, res) {
    const sql = 'UPDATE Atendimentos SET ? WHERE id=?';

    if (valores.data) {
      valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
    }

    conexao.query(sql, [valores, id], (erro, resultado) => {
      if (erro) {
        res.status(400).json();
      } else {
        res.status(200).json({ id, ...valores });
      }
    })
  }

  deleta(id, res) {
    const sql = 'DELETE FROM Atendimentos WHERE id=?';

    conexao.query(sql, id, (erro, resultado) => {
      if (erro) {
        res.status(400).json();
      } else {
        res.status(200).json({ id });
      }
    })
  }
}

module.exports = new Atendimento;