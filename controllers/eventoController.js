const Evento = require('../models/Evento');
const Inscricao = require('../models/Inscricao');

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function getLista(req, res) {
  try {
    const eventos = await Evento.findAll();
    res.render('eventos/lista', { eventos, usuario: req.session });
  } catch (err) {
    console.error('[EVENTOS LISTA ERROR]', err.message, err.code);
    const mensagem = process.env.NODE_ENV === 'production' 
      ? 'Erro ao carregar eventos. Verifique a conexão com o banco.'
      : err.message;
    res.status(500).render('erro', { message: mensagem, error: err });
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function getDetalhe(req, res) {
  try {
    const { id } = req.params;
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    const inscricoes = await Inscricao.findByEvento(id);
    const usuarioJaInscrito = inscricoes.some(i => i.participante_id === req.session.userId);

    res.render('eventos/detalhe', { evento, inscricoes, usuarioJaInscrito, usuario: req.session });
  } catch (err) {
    console.error('[EVENTOS DETALHE ERROR]', err);
    res.status(500).send('Erro ao carregar evento');
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getForm(req, res) {
  res.render('eventos/form', { evento: null, usuario: req.session });
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function postCriar(req, res) {
  try {
    const { titulo, descricao, data_evento, local } = req.body;

    if (!titulo || !data_evento) {
      return res.status(400).render('eventos/form', { evento: null, erro: 'Título e data são obrigatórios' });
    }

    if (titulo.length > 150) {
      return res.status(400).render('eventos/form', { evento: null, erro: 'Título não pode exceder 150 caracteres' });
    }

    await Evento.create(titulo, descricao, data_evento, local, req.session.userId);
    res.redirect('/eventos');
  } catch (err) {
    console.error('[CRIAR EVENTO ERROR]', err);
    res.status(500).render('eventos/form', { evento: null, erro: 'Erro ao criar evento' });
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function getFormEditar(req, res) {
  try {
    const { id } = req.params;
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    if (evento.organizador_id !== req.session.userId) {
      return res.status(403).send('Você não tem permissão para editar este evento');
    }

    res.render('eventos/form', { evento, usuario: req.session });
  } catch (err) {
    console.error('[FORM EDITAR ERROR]', err);
    res.status(500).send('Erro ao carregar formulário');
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function postEditar(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, data_evento, local } = req.body;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    if (evento.organizador_id !== req.session.userId) {
      return res.status(403).send('Você não tem permissão para editar este evento');
    }

    if (!titulo || !data_evento) {
      return res.status(400).render('eventos/form', { evento, erro: 'Título e data são obrigatórios' });
    }

    if (titulo.length > 150) {
      return res.status(400).render('eventos/form', { evento, erro: 'Título não pode exceder 150 caracteres' });
    }

    await Evento.update(id, titulo, descricao, data_evento, local);
    res.redirect(`/eventos/${id}`);
  } catch (err) {
    console.error('[EDITAR EVENTO ERROR]', err);
    res.status(500).send('Erro ao editar evento');
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function postExcluir(req, res) {
  try {
    const { id } = req.params;
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    if (evento.organizador_id !== req.session.userId) {
      return res.status(403).send('Você não tem permissão para excluir este evento');
    }

    await Evento.remove(id);
    res.redirect('/eventos');
  } catch (err) {
    console.error('[EXCLUIR EVENTO ERROR]', err);
    res.status(500).send('Erro ao excluir evento');
  }
}

module.exports = { getLista, getDetalhe, getForm, postCriar, getFormEditar, postEditar, postExcluir };
