import express from 'express';
import { getAll, getChat, loggedIn, login, logout, register } from './controllers/user';
import { auth } from './middelwares/auth';

const Router=express.Router();

Router.post("/login",login);
Router.post("/register",register);
Router.get("/logout",logout)
Router.use(auth);
Router.get('/loggedIn',loggedIn);
Router.get("/users",getAll);
Router.get("/chat/:id1/:id2",getChat);

export default Router;
