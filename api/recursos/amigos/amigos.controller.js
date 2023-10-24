const { Amigo } = require('./amigos.model');

function obtenerAmigos() {
  return Amigo.find({});
}

function obtenerAmigo(usuarioId, seguidorId) {
  return Amigo.findOne({
    usuario: usuarioId,
    seguidor: seguidorId
  });
}

function obtenerSeguidores(usuarioId) {
  return Amigo.find({ seguidor: usuarioId });
}

function obtenerSiguiendo(usuarioId) {
  return Amigo.find({ usuario: usuarioId });
}

function crearAmigo(usuarioId, seguidorId) {
  return new Amigo({
    usuario: usuarioId,
    seguidor: seguidorId
  }).save();
}

function eliminarAmigo(usuarioId, seguidorId) {
  return Amigo.findOneAndRemove({ usuario: usuarioId, seguidor: seguidorId });
}

module.exports = {
  obtenerSeguidores,
  obtenerSiguiendo,
  crearAmigo,
  eliminarAmigo,
  obtenerAmigos,
  obtenerAmigo
};
