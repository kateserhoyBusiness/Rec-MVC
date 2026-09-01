require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const eventosRoutes = require('./routes/eventos');
const inscricoesRoutes = require('./routes/inscricoes');
const { initializeDatabase } = require('./config/init');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta-padrao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.get('/', (req, res) => {
  res.redirect('/eventos');
});

app.use('/', authRoutes);
app.use('/eventos', eventosRoutes);
app.use('/inscricoes', inscricoesRoutes);

app.use((req, res) => {
  res.status(404).render('erro', { message: 'Página não encontrada' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Inicializar banco de dados e depois iniciar servidor
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao iniciar servidor:', err);
    process.exit(1);
  });

