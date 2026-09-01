const Inscricao = require('../models/Inscricao');
const Evento = require('../models/Evento');

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function postInscrever(req, res) {
  try {
    const { id } = req.params;
    const participanteId = req.session.userId;

    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    const inscricaoExistente = await Inscricao.findByEventoAndParticipante(id, participanteId);
    if (inscricaoExistente) {
      return res.status(400).send('Você já está inscrito neste evento');
    }

    await Inscricao.create(id, participanteId);
    res.redirect(`/eventos/${id}`);
  } catch (err) {
    console.error('[INSCREVER ERROR]', err);
    res.status(500).send('Erro ao se inscrever no evento');
  }
}

/**
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function postDesinscrever(req, res) {
  try {
    const { inscricaoId } = req.params;
    const { eventoId } = req.body;

    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).send('Evento não encontrado');
    }

    if (evento.organizador_id !== req.session.userId) {
      return res.status(403).send('Você não tem permissão para remover inscrições');
    }

    await Inscricao.remove(inscricaoId);
    res.redirect(`/eventos/${eventoId}`);
  } catch (err) {
    console.error('[DESINSCREVER ERROR]', err);
    res.status(500).send('Erro ao remover inscrição');
  }
}

module.exports = { postInscrever, postDesinscrever };
