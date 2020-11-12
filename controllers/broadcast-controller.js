

var schedule = require('node-schedule');



exports.createBroadcast = (req, res) => {

  try {
    let currentTime = 0; //Set initial video timestamp to 0
    const broadcastId = req.body.id; // Get broadcast id from client
    // If broadcast id does not exist, start broadcast - else, throw error
    if (!schedule.scheduledJobs[broadcastId]) {
      schedule.scheduleJob(broadcastId, '* * * * * *', function () {
        currentTime++;
        console.log('Running broadcast: ' + broadcastId);
        console.log('Time: ' + currentTime);
      });
      res.status(200).send('Created!');
    } else {
      throw new Error ('Broadcast id allready exists');
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }

};



exports.deleteBroadcast = (req, res) => {
  try {
    const broadcastId = req.body.id; // Get broadcast id from client
    // If broadcast id exists, delete broadcast - else, throw error
    if (schedule.scheduledJobs[broadcastId]) {
      let currentBroadcast = schedule.scheduledJobs[broadcastId];
      currentBroadcast.cancel();
      res.status(200).send('Deleted!');
    } else {
      throw new Error ('Broadcast id does not exist');
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }

};