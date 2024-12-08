import express from "express";
import { deleteById, getUser, getUserById } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user = await getUser();
    return res.status(200).json({ message: "Users found", user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bad request!" }).end();
  }
};

export const deleteUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteById(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bad request!" }).end();
  }
};

export const updateUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.status(404).json({ message: "no such username!" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(401).json({ message: "No such user exist!!" });
    }
    user.username = username;
    await user.save();
    return res
      .status(201)
      .json({ message: "Username updated successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bad request!" }).end();
  }
};
