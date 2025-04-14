
// Notification schema definition
const NotificationSchema = {
  userId: { type: String, required: true },
  type: { type: String, required: true }, // content_warning, account_blocked, message, connection_request, etc.
  message: { type: String, required: true },
  relatedContentId: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
};

export { NotificationSchema };
