import express from 'express';
import Posts from './Posts.Route';
import Users from './Users.Route';
import Comments from './Comments.Route';

const router = express.Router()

export default (): express.Router => {
    Users(router);
    Posts(router);
    Comments(router);
    

    return router;
}