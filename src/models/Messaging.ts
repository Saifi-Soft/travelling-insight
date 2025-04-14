
// Message schema definition
const MessageSchema = {
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  attachments: [{
    type: { type: String, enum: ['image', 'file', 'location'] },
    url: { type: String },
    name: { type: String }
  }]
};

// Conversation schema definition
const ConversationSchema = {
  participants: [{ type: String }], // Array of user IDs
  isGroup: { type: Boolean, default: false },
  name: { type: String }, // Required for group chats
  avatar: { type: String },
  lastMessage: { type: String },
  lastMessageTime: { type: Date },
  unread: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
};

export { MessageSchema, ConversationSchema };
