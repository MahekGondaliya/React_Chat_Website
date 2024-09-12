import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const SearchContact = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm) {
      return res.status(400).send("searchTerm is required.");
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const reget = new RegExp(sanitizedSearchTerm, "i");

    const contact = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstname: reget }, { lastname: reget }, { email: reget }],
        },
      ],
    });

    return res.status(200).json({ contact });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error 505");
  }
};


// export const GetContactForDMList = async (req, res) => {
//   try {
//     const { userid } = req.body;

//     // Ensure userid is valid and convert to ObjectId
//     const userId = new mongoose.Types.ObjectId(userid);

//     const contacts = await Message.aggregate([
//       {
//         // Match messages where the user is either the sender or recipient
//         $match: {
//           $or: [{ sender: userId }, { recipient: userId }],
//         },
//       },
//       {
//         // Sort messages by timestamp (newest first)
//         $sort: { timestamp: -1 },
//       },
//       {
//         // Group by contact (either the sender or recipient who is not the user)
//         $group: {
//           _id: {
//             $cond: {
//               if: { $eq: ["$sender", userId] },
//               then: "$recipient",
//               else: "$sender",
//             },
//           },
//           lastMessageTime: { $first: "$timestamp" }, // Get the last message's timestamp
//         },
//       },
//       {
//         // Lookup user details from the users collection
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "_id",
//           as: "contactInfo",
//         },
//       },
//       { $unwind: "$contactInfo" }, // Unwind the contactInfo array to object
//       {
//         // Project required fields
//         $project: {
//           _id: 1,
//           lastMessageTime: 1,
//           email: "$contactInfo.email",
//           firstname: "$contactInfo.firstname",
//           lastname: "$contactInfo.lastname",
//           image: "$contactInfo.image",
//           color: "$contactInfo.color",
//         },
//       },
//       {
//         // Sort the contacts by the last message time
//         $sort: { lastMessageTime: -1 },
//       },
//     ]);

//     // Return the contact list as a JSON response
//     return res.status(200).json({ contacts });
//   } catch (error) {
//     console.error("Error in GetContactForDMList:", error.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
