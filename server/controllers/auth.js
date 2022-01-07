import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

// pass access key and so on
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async (req, res) => {
  //   console.log(req.body);
  //   res.json("reg user from controller");

  try {
    //   console.log(req.body);
    const { name, email, password } = req.body;

    // validation:
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be at least 6 characters long");
    }

    let userExists = await User.findOne({ email }).exec();
    if (userExists) return res.status(400).send("Email is already taken");

    // hash password
    const hashedPassoword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassoword,
    });
    await user.save();

    // console.log("Saved user", user);
    return res.json({ ok: true });
    // ---------------------------------------------
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error, try again");
  }
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    // check if db has user w/ that email
    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(400).send("No user found");

    // check pass
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // return user and token to client excluding hashed pass
    user.password = undefined;

    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      //   secure: true, // only in https
    });

    // send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error, try again");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "You're now signed out" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURR USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");

    // prepare for email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>User this code to reset your password</p>
                  <h2 style="color:#355C7D;">${shortCode}</h2>
                  <i>Coursefry</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};
