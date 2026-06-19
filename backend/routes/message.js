const router = require("express").Router();

const Message = require("../models/Message");

router.post("/send", async (req, res) => {
  try {
    console.log("SEND BODY:", req.body);

    const newMessage = new Message({
      sender: req.body.sender,
      receiver: req.body.receiver,
      message: req.body.message,
    });

    await newMessage.save();

    return res.status(200).send("Success");
  } catch (err) {
    console.log("SEND ERROR:", err);
    return res.status(500).send("Failed");
  }
});

module.exports = router;

