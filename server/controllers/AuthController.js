import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";
import path from "path";

const maxage = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.JWT_KEY, {
    expiresIn: maxage,
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password is requird");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("user not found");
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return res.send("password is incorrect");
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxage,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profilesetup: user.profilesetup,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error login ");
  }
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password is requird");
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxage,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profilesetup: user.profilesetup,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error ");
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findOne(req.userId);
    if (!userData) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profilesetup: userData.profilesetup,
      firstname: userData.firstname,
      lastname: userData.lastname,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error ");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstname, lastname, color, user } = req.body;

    if (!firstname || !lastname) {
      return res.status(400).send("enter all data");
    }

    const userData = await User.findByIdAndUpdate(
      user,
      { firstname, lastname, color, profilesetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profilesetup: userData.profilesetup,
      firstname: userData.firstname,
      lastname: userData.lastname,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error 505 ");
  }
};

export const profileImageSetUp = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!req.file) {
      // Check if the file exists
      return res.status(400).send("File is required.");
    }

    // Generate a unique file name with timestamp
    const date = Date.now();
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `uploads/profiles/${date}${fileExtension}`;

    // Rename file to include timestamp and save it to the new path
    renameSync(req.file.path, fileName);

    // Update user document with the new image path
    const userData = await User.findByIdAndUpdate(
      userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    // Respond with the updated user data
    return res.status(200).json({
      image: userData.image,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error.");
  }
};

export const removeProfileImg = async (req, res) => {
  try {
    
    
    const user = await User.findOne(req.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();
    return res.status(200).send("profile image deleted");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error 505 ");
  }
};
export const logOut = async (req, res) => {
  try {
    
    res.cookie("jwt" ,"" , {maxage:1,secure:true,sameSite:"None",})
    return res.status(200).send("Logout Successfully........");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error 505 ");
  }
};
