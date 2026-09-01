const pool = require('../config/db');

/**
 * @async
 * @param {string} email
 * @returns {Promise<object>}
 */
async function findByEmail(email) {
  const conexao = await pool.getConnection();
  try {
    const [rows] = await conexao.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
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
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  } finally {
    conexao.release();
  }
}

/**
 * @async
 * @param {string} nome
 * @param {string} email
 * @param {string} senhaHash
 * @param {string} tipo
 * @returns {Promise<object>}
 */
async function create(nome, email, senhaHash, tipo) {
  const conexao = await pool.getConnection();
  try {
    const [result] = await conexao.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, tipo]
    );
    return { id: result.insertId, nome, email, tipo };
  } finally {
    conexao.release();
  }
}

module.exports = { findByEmail, findById, create };
