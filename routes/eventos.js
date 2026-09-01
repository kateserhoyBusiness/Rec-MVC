const express = require('express');
const router = express.Router();
const { requireLogin, requireOrganizador } = require('../middlewares/auth');
const eventoController = require('../controllers/eventoController');

router.get('/', eventoController.getLista);
router.get('/novo', requireLogin, requireOrganizador, eventoController.getForm);
router.post('/novo', requireLogin, requireOrganizador, eventoController.postCriar);
router.get('/:id', eventoController.getDetalhe);
router.get('/:id/editar', requireLogin, requireOrganizador, eventoController.getFormEditar);
router.post('/:id/editar', requireLogin, requireOrganizador, eventoController.postEditar);
router.post('/:id/excluir', requireLogin, requireOrganizador, eventoController.postExcluir);

module.exports = router;
