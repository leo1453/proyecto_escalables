// controllers/messages.js
const MessagesRepository = require('../repositories/messages'); // Importa el repositorio de mensajes
const UserRepository = require('../repositories/users'); // Importa el repositorio de usuarios para obtener el nombre

// Obtener todos los mensajes del usuario autenticado
// Obtener todos los mensajes del usuario autenticado
const getMessages = async (req, res) => {
  const userId = req.userId; // Usuario autenticado
  const { receiverId } = req.query; // Receptor seleccionado (debe venir en la consulta)

  console.log("ID del usuario autenticado:", userId);  // Verificar ID del usuario
  console.log("ID del receptor recibido:", receiverId);  // Verificar ID del receptor

  if (!receiverId) {
    return res.status(400).json({ msg: 'Falta el ID del receptor' });
  }

  try {
    // Buscar mensajes donde el remitente o el receptor sea el usuario autenticado
    const messages = await MessagesRepository.getAllByUserAndReceiver(userId, receiverId);

    // Rellenar los mensajes con los nombres de usuario
    const messagesWithUsernames = await Promise.all(messages.map(async (message) => {
      const senderUser = await UserRepository.getUserById(message.sender);  // Obtener datos del remitente
      const receiverUser = await UserRepository.getUserById(message.receiver); // Obtener datos del receptor
      
      return {
        ...message.toObject(),
        senderName: senderUser.username, // Agregar nombre del remitente
        receiverName: receiverUser.username, // Agregar nombre del receptor
      };
    }));

    res.json(messagesWithUsernames); // Devolver los mensajes con nombres de usuarios
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los mensajes', error });
  }
};



// Enviar un mensaje
const sendMessage = async (req, res) => {
  const { content, receiver } = req.body;  // Usamos `receiver` en lugar de `recipientId`
  const sender = req.userId;  // El usuario autenticado es el remitente

  console.log("Datos recibidos:", { content, receiver, sender });  // Verificar los datos

  if (!receiver) {
    return res.status(400).json({ msg: 'El receptor es requerido' });
  }

  try {
    // Crear el mensaje con los datos recibidos
    const newMessage = await MessagesRepository.create({
      content,
      sender,
      receiver,
    });

    // Obtener los nombres de los usuarios (remitente y receptor)
    const senderUser = await UserRepository.getUserById(sender);
    const receiverUser = await UserRepository.getUserById(receiver);

    // Incluir los nombres en la respuesta
    res.status(201).json({
      msg: 'Mensaje enviado',
      message: {
        ...newMessage.toObject(),
        senderName: senderUser.username,
        receiverName: receiverUser.username,
      }
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);  // Mostrar detalles del error en consola
    res.status(500).json({ msg: 'Error al enviar el mensaje', error: error.message });  // Enviar el mensaje de error
  }
};

module.exports = { getMessages, sendMessage };



