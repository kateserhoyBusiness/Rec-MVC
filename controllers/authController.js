const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getRegistro(req, res) {
  res.render('registro');
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function postRegistro(req, res) {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).render('registro', { erro: 'Todos os campos são obrigatórios' });
    }

    if (tipo !== 'organizador' && tipo !== 'participante') {
      return res.status(400).render('registro', { erro: 'Tipo de usuário inválido' });
    }

    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).render('registro', { erro: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await Usuario.create(nome, email, senhaHash, tipo);

    res.redirect('/login');
  } catch (err) {
    console.error('[REGISTRO ERROR]', err);
    res.status(500).render('registro', { erro: 'Erro ao registrar usuário' });
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getLogin(req, res) {
  res.render('login');
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function postLogin(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).render('login', { erro: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(400).render('login', { erro: 'Email ou senha inválidos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(400).render('login', { erro: 'Email ou senha inválidos' });
    }

    req.session.userId = usuario.id;
    req.session.nome = usuario.nome;
    req.session.tipo = usuario.tipo;

    res.redirect('/eventos');
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).render('login', { erro: 'Erro ao fazer login' });
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = { getRegistro, postRegistro, getLogin, postLogin, logout };
