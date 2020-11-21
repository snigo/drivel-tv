import { Router } from 'express';
import {
  getAllBroadcast,
  getBroadcast,
  createBroadcast,
  deleteBroadcast,
} from './controllers/broadcast-controller';

export const router = Router();

// Route to get all broadcasts
router.get('/api/get-all-broadcasts', getAllBroadcast);
// Route to get broadcast page (by client POSTing id to identify broadcast)
router.post('/api/get-broadcast', getBroadcast);
// Route to create a new broadcast
router.post('/api/create-broadcast', createBroadcast);
// Route to delete a broadcast
router.delete('/api/delete-broadcast', deleteBroadcast);
