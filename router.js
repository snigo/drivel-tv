
const router = require('express').Router();
const broadcastController = require('./controllers/broadcast-controller');


router.post('/api/create-broadcast', broadcastController.createBroadcast);
router.delete('/api/delete-broadcast', broadcastController.deleteBroadcast);


module.exports = router;