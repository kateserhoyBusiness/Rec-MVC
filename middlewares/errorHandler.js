/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message;

  console.error('[ERROR]', err);

  res.status(statusCode).render('erro', { message });
}

module.exports = errorHandler;
