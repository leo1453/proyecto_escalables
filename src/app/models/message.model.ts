export interface Message {
    sender: string; // ID del remitente
    receiver: string; // ID del receptor
    content: string; // Contenido del mensaje
    timestamp: Date; // Marca de tiempo del mensaje
    senderName?: string; // Nombre del remitente (opcional)
  }
  