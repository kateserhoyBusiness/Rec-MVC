CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  tipo ENUM('organizador','participante') NOT NULL
);

CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  data_evento DATETIME NOT NULL,
  local VARCHAR(150),
  organizador_id INT NOT NULL,
  FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
);

CREATE TABLE inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evento_id INT NOT NULL,
  participante_id INT NOT NULL,
  data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unico_participante_evento (evento_id, participante_id),
  FOREIGN KEY (evento_id) REFERENCES eventos(id),
  FOREIGN KEY (participante_id) REFERENCES usuarios(id)
);