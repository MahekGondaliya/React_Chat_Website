import Message from "../models/MessagesModel.js";
import User from "../models/UserModel.js";

export const GetMessages = async (req, res) => {
  try {
    const user1 = req.body.userid;
    
    const user2 = req.body.id;

    
    if (!user1 ||  !user2) {
      return res.status(400).send("both user is required");
    }

    const messages = await Message.find({
        $or:[
            {sender:user1 ,recipient:user2},
            {sender:user2 ,recipient:user1},
        ],

    }).sort({timestamp:1})
    return res.status(200).json({ messages });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error 505");
  }
};
