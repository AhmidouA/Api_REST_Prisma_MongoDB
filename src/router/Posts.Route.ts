import express from 'express';
import { getPosts } from '../controller/Posts.Controller';


export default (router: express.Router) => {
    router.get('/posts', getPosts)
}