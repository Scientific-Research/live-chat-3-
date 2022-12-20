const User = require("../models/authModel");

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
