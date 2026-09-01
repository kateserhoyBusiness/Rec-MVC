const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middlewares/auth');
const inscricaoController = require('../controllers/inscricaoController');

router.post('/:id', requireLogin, inscricaoController.postInscrever);
router.post('/:inscricaoId/remover', requireLogin, inscricaoController.postDesinscrever);

module.exports = router;
