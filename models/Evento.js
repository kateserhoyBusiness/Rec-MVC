const pool = require('../config/db');

/**
 * @async
 * @returns {Promise<Array>}
 */
async function findAll() {
  const conexao = await pool.getConnection();
  try {
    const [rows] = await conexao.execute(
      'SELECT e.*, u.nome as organizador_nome FROM eventos e JOIN usuarios u ON e.organizador_id = u.id ORDER BY e.data_evento ASC'
    );
    return rows;
  } finally {
    conexao.release();
  }
}

/**
 * @async
 * @param {number} id
 * @returns {Promise<object>}
 */
async function findById(id) {
  const conexao = await pool.getConnection();
  try {
    const [rows] = await conexao.execute(
      'SELECT e.*, u.nome as organizador_nome FROM eventos e JOIN usuarios u ON e.organizador_id = u.id WHERE e.id = ?',
      [id]
    );
    return rows[0];
  } finally {
    conexao.release();
  }
}

/**
 * @async
 * @param {string} titulo
 * @param {string} descricao
 * @param {string} dataEvento
 * @param {string} local
 * @param {number} organizadorId
 * @returns {Promise<object>}
 */
async function create(titulo, descricao, dataEvento, local, organizadorId) {
  const conexao = await pool.getConnection();
  try {
    const [result] = await conexao.execute(
      'INSERT INTO eventos (titulo, descricao, data_evento, local, organizador_id) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao, dataEvento, local, organizadorId]
    );
    return { id: result.insertId, titulo, descricao, dataEvento, local, organizadorId };
  } finally {
    conexao.release();
  }
}

/**
 * @async
 * @param {number} id
 * @param {string} titulo
 * @param {string} descricao
 * @param {string} dataEvento
 * @param {string} local
 * @returns {Promise<void>}
 */
async function update(id, titulo, descricao, dataEvento, local) {
  const conexao = await pool.getConnection();
  try {
    await conexao.execute(
      'UPDATE eventos SET titulo = ?, descricao = ?, data_evento = ?, local = ? WHERE id = ?',
      [titulo, descricao, dataEvento, local, id]
    );
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
    await conexao.execute('DELETE FROM eventos WHERE id = ?', [id]);
  } finally {
    conexao.release();
  }
}

module.exports = { findAll, findById, create, update, remove };
