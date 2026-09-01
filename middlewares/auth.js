/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
function requireOrganizador(req, res, next) {
  if (!req.session.userId || req.session.tipo !== 'organizador') {
    return res.status(403).send('Acesso negado. Apenas organizadores podem acessar esta ação.');
  }
  next();
}

module.exports = { requireLogin, requireOrganizador };
