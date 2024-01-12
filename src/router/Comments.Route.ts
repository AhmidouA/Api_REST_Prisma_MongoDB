import express from 'express';
import { createComment, getComments, getCommentById, updateComment, deleterComment } from '../controller/Comments.Controller';


export default (router: express.Router) => {
    router.get('/comments', getComments);
    router.get('/comments/:id', getCommentById);
    router.post('/comments/:id', createComment);
    router.patch('/comments/:id', updateComment);
    router.delete('/comments/:id', deleterComment);

}