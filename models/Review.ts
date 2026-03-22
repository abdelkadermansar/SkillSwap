// models/Review.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  fromUser: string;
  toUser: string;
  conversationId?: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'évaluateur est requis']
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'évalué est requis']
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);