const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const amigoSchema = new mongoose.Schema(
  {
    usuario: {
      type: ObjectId,
      required: [true, 'Usuario a ser seguido'],
      index: true
    },
    seguidor: {
      type: ObjectId,
      required: [true, 'Nuevo seguidor'],
      index: true
    }
  },
  { timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' } }
);

amigoSchema.index({
  usuario: 1,
  seguidor: 1
});

const Amigo = mongoose.model('amigo', amigoSchema);

module.exports = {
  Amigo
};
