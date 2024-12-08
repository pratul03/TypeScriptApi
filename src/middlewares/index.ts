import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    const currentUserId = get(req, "identity._id") as unknown as string;
    if (!currentUserId) {
      return res.status(403).json({ message: "Id not found!" });
    }
    if (currentUserId.toString() !== id) {
      return res.status(404).json({ message: "Id didn't match 🥹" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bad request!" }).end();
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["PRATUL-AUTH"];
    if (!sessionToken) {
      return res.status(403).json({ message: "No token found" });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(402).json({ message: "No such user !" });
    }
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bad request!", error }).end();
  }
};
