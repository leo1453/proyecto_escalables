const Message = require('../models/message');  // Asegúrate de que esta línea esté presente

class MessagesRepository {
  // Crear un nuevo mensaje
  async create(messageData) {
    const message = new Message({
      sender: messageData.sender,
      receiver: messageData.receiver,
      content: messageData.content,
    });
    return await message.save(); // Guarda el mensaje en la base de datos
  }

  // Obtener todos los mensajes de un usuario
  async getAllByUser(userId) {
    return await Message.find({
      $or: [{ sender: userId }, { receiver: userId }] // Busca mensajes donde el usuario sea el remitente o el destinatario
    });
  }

  // Obtener un mensaje por ID
  async getById(messageId) {
    return await Message.findById(messageId); // Busca un mensaje por su ID
  }

  // Eliminar un mensaje por ID
  async delete(messageId) {
    return await Message.findByIdAndDelete(messageId); // Elimina el mensaje por su ID
  }

  // repositories/messagesRepository.js
async getAllByUserAndReceiver(senderId, receiverId) {
  return await Message.find({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId }
    ]
  });
}

}

module.exports = new MessagesRepository();
