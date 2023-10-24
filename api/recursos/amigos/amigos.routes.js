const express = require('express');
const passport = require('passport');

const log = require('../../../utils/logger');

const procesarErrores = require('../../libs/errorHandler').procesarErrores;
const { validarId } = require('../../libs/mongoUtils');

const amigosController = require('./amigos.controller');

const jwtAuthenticate = passport.authenticate('jwt', { session: false });
const amigosRouter = express.Router();

amigosRouter.get(
  '/',
  procesarErrores((req, res) => {
    return amigosController.obtenerAmigos().then(amigos => {
      res.json(amigos);
    });
  })
);

// Ruta que responde ¿Estoy siguiendo al usuario con el :id?
amigosRouter.get(
  '/:id/siguiendo',
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    const amigo = await amigosController.obtenerAmigo(
      req.user.id,
      req.params.id
    );
    log.info(`Amigo agregada ${req.user.id} sigue a ${req.query.id}`);
    res.json({ siguiendo: !!amigo });
  })
);

amigosRouter.post(
  '/:id/seguir',
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    const amigo = await amigosController.crearAmigo(
      req.user.id,
      req.params.id
    );
    log.info(`Amigo agregada ${req.user.id} sigue a ${req.query.id}`);
    res.status(201).json(amigo);
  })
);

amigosRouter.delete(
  '/:id/eliminar',
  [jwtAuthenticate, validarId],
  procesarErrores(async (req, res) => {
    const amigo = await amigosController.eliminarAmigo(
      req.user.id,
      req.params.id
    );
    log.info(`Amigo eliminada ${req.user.id} ya no sigue a ${req.query.id}`);
    res.json(amigo);
  })
);

module.exports = amigosRouter;
