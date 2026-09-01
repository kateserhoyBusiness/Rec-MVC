const pool = require('../config/db');

/**
 * @async
 * @param {number} eventoId
 * @returns {Promise<Array>}
 */
async function findByEvento(eventoId) {
  const conexao = await pool.getConnection();
  try {
    const [rows] = await conexao.execute(
      'SELECT i.*, u.nome as participante_nome, u.email FROM inscricoes i JOIN usuarios u ON i.participante_id = u.id WHERE i.evento_id = ? ORDER BY i.data_inscricao DESC',
      [eventoId]
    );
    return rows;
  } finally {
    conexao.release();
  }
}

/**
 * @async
 * @param {number} eventoId
 * @param {number} participanteId
 * @returns {Promise<object>}
 */
async function findByEventoAndParticipante(eventoId, participanteId) {
  const conexao = await pool.getConnection();
  try {
    const [rows] = await conexao.execute(
      'SELECT * FROM inscricoes WHERE evento_id = ? AND participante_id = ?',
      [eventoId, participanteId]
    );
    return rows[0];
  } finally {
    conexao.release();
  }
}

/**
 * @async
 * @param {number} eventoId
 * @param {number} participanteId
 * @returns {Promise<object>}
 */
async function create(eventoId, participanteId) {
  const conexao = await pool.getConnection();
  try {
    const [result] = await conexao.execute(
      'INSERT INTO inscricoes (evento_id, participante_id) VALUES (?, ?)',
      [eventoId, participanteId]
    );
    return { id: result.insertId, eventoId, participanteId };
  } finally {
    conexao.release();
  }
}

/**
 * @async
 * @param {number} id
 * @returns {Promise<void>}
 */
async function remove(id) {
  const conexao = await pool.getConnection();
  try {
    await conexao.execute('DELETE FROM inscricoes WHERE id = ?', [id]);
  } finally {
    conexao.release();
  }
}

module.exports = { findByEvento, findByEventoAndParticipante, create, remove };
