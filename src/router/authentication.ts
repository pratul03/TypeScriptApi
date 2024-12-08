import express, { Application } from "express";
import { login, register } from "../controllers/authentication.controller";

export default (router: express.Router) => {
  router.post("/auth/register", register as Application);
  router.post("/auth/login", login as Application);
};
