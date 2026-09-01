const pool = require('./db');

async function initializeDatabase() {
  const conn = await pool.getConnection();
  try {
    console.log('🔍 Verificando banco de dados...');

    // Verificar se a tabela usuarios existe
    const [tables] = await conn.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [process.env.DB_NAME]
    );

    if (tables.length === 0) {
      console.log('📝 Criando tabelas...');
      
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          senha_hash VARCHAR(255) NOT NULL,
          tipo ENUM('organizador','participante') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS eventos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(150) NOT NULL,
          descricao TEXT,
          data_evento DATETIME NOT NULL,
          local VARCHAR(150),
          organizador_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organizador_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
      `);

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS inscricoes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          evento_id INT NOT NULL,
          participante_id INT NOT NULL,
          data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unico_participante_evento (evento_id, participante_id),
          FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
          FOREIGN KEY (participante_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
      `);

      console.log('✅ Tabelas criadas com sucesso!');
    } else {
      console.log(`✅ Banco de dados OK (${tables.length} tabelas encontradas)`);
    }

  } catch (err) {
    console.error('❌ Erro ao inicializar banco:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { initializeDatabase };
