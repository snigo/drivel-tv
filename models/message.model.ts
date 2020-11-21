import { model, Schema } from 'mongoose';

export interface Message {
  sender: string;
  msg: string;
  room: string;
}

// Create new Message schema
const messageSchema = new Schema({
  sender: { type: String, required: true },
  msg: { type: String, required: true },
  room: { type: String, required: true },
}, { timestamps: true }); // Set automatic timestamp for every document

export const Message = model('Message', messageSchema);
