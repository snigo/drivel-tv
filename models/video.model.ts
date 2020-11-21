import { model, Schema } from 'mongoose';

export interface Video {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  length: string;
}

// Create new Video schema
const videoSchema = new Schema({
  youtubeId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnailUrl: String,
  length: { type: String, required: true },
}, { timestamps: true }); // Set automatic timestamp for every document

export const Video = model('Video', videoSchema);
