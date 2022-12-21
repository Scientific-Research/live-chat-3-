const formidable = require("formidable");
const User = require("../models/authModel");
const messageModel = require("../models/messageModel");
const path = require("path");
const fs = require("fs");

module.exports.getFriends = async (req, res) => {
  //   console.log(
  //     "This is a message from messenger Controller-everything till here works fine."
  //   );
  const myId = req.myId;
  // console.log("Your Id in Database:" + myId);

  try {
    const friendGet = await User.find({});
    // console.log(friendGet); //show us all the people in the Database in Terminal,when we just refresh the Page.
    const filter = friendGet.filter((friend) => friend.id !== myId);
    res.status(200).json({ success: true, friends: filter });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server Error",
      },
    });
  }
};

module.exports.messageUploadDB = async (req, res) => {
  const { senderName, receiverId, message } = req.body;
  const senderId = req.myId;

  try {
    const insertMessage = await messageModel.create({
      senderId: senderId,
      senderName: senderName,
      receiverId: receiverId,
      message: {
        text: message,
        image: "",
      },
    });
    res.status(201).json({
      success: true,
      message: insertMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server Error",
      },
    });
  }
  // console.log(req.body);
  // console.log(senderId);
};

module.exports.messageGet = async (req, res) => {
  const myId = req.myId; // current Id of  the logged in user.
  const fdId = req.params.id;
  // console.log(myId);
  // console.log(fdId); // id of the selected Person, whom i  write the message.

  try {
    let getAllMessage = await messageModel.find({});
    // console.log(getAllMessage);
    getAllMessage = getAllMessage.filter(
      (m) =>
        (m.senderId === myId && m.receiverId === fdId) ||
        (m.receiverId === myId && m.senderId === fdId)
    );
    res.status(200).json({
      success: true,
      message: getAllMessage,
    });
    console.log(getAllMessage);
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};

module.exports.imageMessageSend = (req, res) => {
  const senderId = req.myId;

  const form = formidable();
  form.parse(req, (err, fields, files) => {
    // console.log(fields);
    // console.log(files);

    const { senderName, receiverId, imageName } = fields;

    const newPath = path.join(
      `/home/user/assignments/live-chat(3)/frontend/public/images/${imageName}`
    );
    files.image.originalFilename = imageName;

    try {
      fs.copyFile(files.image.filepath, newPath, async (err) => {
        if (err) {
          res.status(500).json({
            error: {
              errorMessage: "Image upload failed!",
            },
          });
        } else {
          const insertMessage = await messageModel.create({
            senderId: senderId,
            senderName: senderName,
            receiverId: receiverId,
            message: {
              text: "",
              image: files.image.originalFilename,
            },
          });
          res.status(201).json({
            success: true,
            message: insertMessage,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error",
        },
      });
    }
  });
};
