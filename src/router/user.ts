import express, {
  Application,
  RequestHandler,
  RequestParamHandler,
} from "express";
import {
  deleteUsers,
  getAllUsers,
  updateUsers,
} from "../controllers/users.controller";
import { isAuthenticated, isOwner } from "../middlewares/index";

export default (router: express.Router) => {
  router.get(
    "/users",
    isAuthenticated as RequestHandler,
    getAllUsers as Application
  );
  router.delete(
    "/users/:id",
    isAuthenticated as RequestHandler,
    isOwner as RequestHandler,
    deleteUsers as Application
  );
  router.patch(
    "/users/:id",
    isAuthenticated as RequestHandler,
    isOwner as RequestHandler,
    updateUsers as Application
  );
};
