const moment = require('moment');
const axios = require('axios');
const conexao = require('../infraestrutura/database/conexao');
const repositorio = require('../repositorios/atendimentos');
const atendimentos = require('../repositorios/atendimentos');

class Atendimento {

  constructor() {
    this.dataValida = ({ data, dataCriacao }) => moment(data).isSameOrAfter(dataCriacao);

    this.cpfValido = (tamanho) => tamanho === 11;

    this.valida = parametros => this.validacoes.filter(campo => {
      const { nome } = campo;
      const parametro = parametros[nome];
      return !campo.valido(parametro);
    });

    this.validacoes = [
      {
        nome: 'data',
        valido: this.dataValida,
        mensagem: 'Data deve ser maior ou igual a data atual'
      },
      {
        nome: 'cliente',
        valido: this.cpfValido,
        mensagem: 'CPF do Cliente invalido'
      }
    ];
  }

  adiciona(atendimento) {
    const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

    const parametros = {
      data: { data, dataCriacao },
      cliente: { tamanho: atendimento.cliente.length }
    };

    const erros = this.valida(parametros);
    const existemErros = erros.length;

    if (existemErros) {
      return new Promise((resolve, reject) => reject(erros));
    } else {
      const atendimentoDatado = { ...atendimento, dataCriacao, data }

      return repositorio.adiciona(atendimentoDatado)
        .then((resultados) => {
          const id = resultados.insertId
          return { ...atendimento, id }
        });
    }
  }

  lista() {
    return repositorio.lista();
  }

  buscaPorId(id) {

    if (isNaN(id)) {
      const erros = {
        nome: 'id',
        mensagem: 'Id do cliente não informado'
      };
      return new Promise((resolve, reject) => reject(erros));
    } else {
      return repositorio.buscaPorId(id).then((resultado) => {
        return this.buscaDadosCliente(resultado[0]);
      })
    }
  }

  async buscaDadosCliente(atendimento) {
    const cpf = atendimento.cliente;
    const { data } = await axios.get(`http://localhost:8082/${cpf}`);
    atendimento.cliente = data;
    return { ...atendimento };
  }

  altera(id, valores) {

    if (isNaN(id)) {
      const erros = {
        nome: 'id',
        mensagem: 'Id do cliente não informado'
      };
      return new Promise((resolve, reject) => reject(erros));
    } else {

      if (valores.data) {
        valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
      }

      return repositorio.altera(id, valores)
        .then(() => {
          return { id, ...valores };
        });
    }
  }

  deleta(id) {
    if (isNaN(id)) {
      const erros = {
        nome: 'id',
        mensagem: 'Id do cliente não informado'
      };
      return new Promise((resolve, reject) => reject(erros));
    } else {
      return repositorio.deleta(id)
        .then(() => {
          return { id };
        });
    }
  }
}

module.exports = new Atendimento;