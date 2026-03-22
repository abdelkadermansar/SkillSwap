// models/Conversation.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: string[];
  offerId?: string;
  lastMessage?: string;
  lastMessageAt: Date;
  unreadCount: Map<string, number>;
  status: 'active' | 'archived';
}

const ConversationSchema = new Schema<IConversation>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  offerId: {
    type: Schema.Types.ObjectId,
    ref: 'Offer'
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
});

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);