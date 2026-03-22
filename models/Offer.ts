import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  userId: string;
  type: 'offer' | 'request';
  title: string;
  description: string;
  category: string;
  skillName: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  location?: string;
  remotePossible: boolean;
  availability: string[];
  images: string[];
  status: 'active' | 'filled' | 'closed';
  createdAt: Date;
}

const OfferSchema = new Schema<IOffer>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['offer', 'request'], required: true, default: 'offer' },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  skillName: { type: String, required: true, trim: true },
  level: { type: String, enum: ['débutant', 'intermédiaire', 'avancé'], default: 'débutant' },
  location: { type: String, default: '' },
  remotePossible: { type: Boolean, default: true },
  availability: [{ type: String }],
  images: [{ type: String, default: [] }],
  status: { type: String, enum: ['active', 'filled', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);
