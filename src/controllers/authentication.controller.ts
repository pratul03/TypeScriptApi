import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers/index";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(401).json({ message: "Credentials missing!!" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(404).json({ message: "User already exists!!" });
    }

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res
      .status(200)
      .json({ message: "User created successfully!", user });
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "An error occurred" });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: "Missing credentials!!" }).end();
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(402).json({ message: "No user found" });
    }

    if (!user.authentication?.salt) {
      throw new Error("Salt is missing for authentication");
    }
    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication?.password !== expectedHash) {
      return res.status(404).json({ message: "Wrong password" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie("PRATUL-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(201).json({ message: "Logged in successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bad request!" }).end();
  }
};
