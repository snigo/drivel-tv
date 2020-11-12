
// Import express router
const router = require('express').Router();
const broadcastController = require('./controllers/broadcast-controller');

// Route to create a new broadcast
router.post('/api/create-broadcast', broadcastController.createBroadcast);
// Route to delete a broadcast
router.delete('/api/delete-broadcast', broadcastController.deleteBroadcast);

module.exports = router;