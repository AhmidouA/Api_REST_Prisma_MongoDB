import express from 'express';
import Posts from './Posts.Route';
import Users from './Users.Route';

const router = express.Router()

export default (): express.Router => {
    Posts(router);
    Users(router);
    

    return router;
}