import { model, Schema } from 'mongoose';

export interface Broadcast {
  broadcastId: string;
  title: string;
  description?: string;
  tags?: string;
  thumbnailUrl: string;
  owner: string;
  isReversed: boolean;
  youtubePlaylists: string[];
  videoArray: any[];
  currentVideo: string;
  currentVideoLength: string;
  currentTime: number;
  nextVideo: string;
  nextVideoLength: string;
}

// Create new Broadcast schema
const broadcastSchema = new Schema({
  broadcastId: { type: String, required: true, unique: true},
  title: { type: String, required: true },
  description: String,
  tags: String,
  thumbnailUrl: { type: String, required: true },
  owner: { type: String, required: true },
  isReversed: { type: Boolean, required: true },
  youtubePlaylists: { type: Array, required: true },
  videoArray: { type: Array, required: true },
  currentVideo: { type: String, required: true },
  currentVideoLength: { type: String, required: true },
  currentTime: { type: Number, required: true },
  nextVideo: { type: String, required: true },
  nextVideoLength: { type: String, required: true },
}, { timestamps: true }); // Set automatic timestamp for every document

export const Broadcast = model('Broadcast', broadcastSchema);