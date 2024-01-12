import express from 'express';
import { getPosts, createPost, getPostById, updatePost, deleterPost } from '../controller/Posts.Controller';


export default (router: express.Router) => {
    router.get('/posts', getPosts);
    router.get('/posts/:id', getPostById);
    router.post('/posts/:id', createPost);
    router.patch('/posts/:id', updatePost);
    router.delete('/posts/:id', deleterPost);

}