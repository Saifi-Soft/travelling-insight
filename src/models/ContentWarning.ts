
// Content warning schema definition
const ContentWarningSchema = {
  userId: { type: String, required: true },
  contentId: { type: String, required: true }, // ID of the post or comment
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  acknowledged: { type: Boolean, default: false },
  acknowledgedAt: { type: Date },
};

export { ContentWarningSchema };
