import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleterUser } from '../controller/Users.Controller';


export default (router: express.Router) => {
    router.get('/users', getUsers);
    router.get('/users/:id', getUserById);
    router.post('/users/signup', createUser);
    router.patch('/users/:id', updateUser);
    router.delete('/users/:id', deleterUser);
}

