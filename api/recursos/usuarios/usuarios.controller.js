const Usuario = require('./usuarios.model');
const { Amigo } = require('../amigos/amigos.model');
const { obtenerAmigo } = require('../amigos/amigos.controller');

function obtenerUsuarios() {
  return Usuario.find({});
}

function obtenerUsuariosExplore(idUsuario) {
  return Amigo.find({ usuario: idUsuario }, 'usuario seguidor')
    .then(seguidos => seguidos.map(s => s.seguidor))
    .then(idsSeguidos => {
      return Usuario.find({ _id: { $nin: idsSeguidos } });
    });
}

function crearUsuario(usuario, hashedPassword) {
  return new Usuario({
    ...usuario,
    password: hashedPassword
  }).save();
}

function usuarioExiste(username, email) {
  return new Promise((resolve, reject) => {
    Usuario.find()
      .or([{ username: username }, { email: email }])
      .then(usuarios => {
        resolve(usuarios.length > 0);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function obtenerUsuario(
  { username: username, id: id, email: email },
  usuarioLoggeadoId
) {
  if (username) {
    return obtenerUsuarioConQuery({ username: username }, usuarioLoggeadoId);
  } else if (id) {
    return obtenerUsuarioConQuery({ _id: id });
  } else if (email) {
    return obtenerUsuarioConQuery({ email: email });
  } else {
    throw new Error(
      'Función obtener usuario del controller fue llamada sin especificar username, email o id.'
    );
  }
}

async function obtenerUsuarioConQuery(query, usuarioLoggeadoId) {
  const usuario = await Usuario.findOne(query)
    .populate('numSeguidores')
    .populate('numSiguiendo');

  // Esto se necesita para saber si el usuario que esta loggeado sigue al usuario que
  // se esta pidiendo por el API. No me gusta que sea condicional.
  if (usuarioLoggeadoId && usuario) {
    const sigueAUsuarioLoggeado = await obtenerSiUsuarioLoggeadoSigueAUsuario(
      usuario._id,
      usuarioLoggeadoId
    );
    usuario.siguiendo = sigueAUsuarioLoggeado;
  }

  return usuario;
}

async function obtenerSiUsuarioLoggeadoSigueAUsuario(
  usuarioId,
  usuarioLoggeadoId
) {
  const amigo = await obtenerAmigo(usuarioLoggeadoId, usuarioId);

  return !!amigo;
}

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  usuarioExiste,
  obtenerUsuario,
  obtenerUsuariosExplore
};
