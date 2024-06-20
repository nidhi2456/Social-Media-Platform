const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// @route    GET api/messages/:username
// @desc     Get all messages between authenticated user and specified user
// @access   Private
router.get('/:username', auth, async (req, res) => {
  console.log(`Authenticated user: ${req.user.username}`);
  console.log(`Requesting messages with: ${req.params.username}`);
  // console.log(req.params)
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.username, receiver: req.params.username },
        { sender: req.params.username, receiver: req.user.username }
      ]
    }).sort({ date: -1 });
    
    console.log('Messages found:', messages.length);
    // console.log(res)
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/messages
// @desc     Send a message
// @access   Private
router.post('/', auth, async (req, res) => {
  const { receiverUsername, text } = req.body;
  
  console.log(`Sending message from ${req.user.username} to ${receiverUsername}`);
  
  try {
    const newMessage = new Message({
      sender: req.user.username,
      receiver: receiverUsername,
      text
    });

    const message = await newMessage.save();

    console.log('Message saved:', message);

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
