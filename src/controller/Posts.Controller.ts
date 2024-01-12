/* Component  */
import prisma from "../config/db.config";
import { PostReadTypes, PostWriteTypes } from "shared/postsTypes";

/* Npm  */
import express from "express";
import chalk from "chalk"; // @4.1.2

const info = chalk.bold.blue;
const error = chalk.bgRed;

export const getPosts = async (req: express.Request, res: express.Response) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        datePostPublished: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments : {
          select: {
            id: true,
            comment: true
          }
        }
      },
    });

    return res.json({ status: 200, data: posts });
  } catch (error) {
    console.error("Error getPost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const createPost = async (
  req: express.Request,
  res: express.Response
) => {
  const autherId = req.params.id;
  const { title, description }: PostWriteTypes = req.body;
  console.log("title", title);

  try {
    const getUser = await prisma.user.findUnique({
      where: { id: autherId },
    });

    if (!getUser) return res.json({ status: 400, message: "User not found" });

    if (!title || !description)
      return res.json({ status: 400, message: "Post Incomplete" });

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        datePostPublished: new Date(),
        author: {
          connect: { id: autherId },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        datePostPublished: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({ status: 200, data: newPost, message: "Post created" });
  } catch (error) {
    console.error("Error createPost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const getPostById = async (
  req: express.Request,
  res: express.Response
) => {
  const postId = req.params.id;

  try {
    if (!postId) return res.json({ status: 400, message: "Post not found" });
    const postbyId :PostReadTypes = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    return res.json({ status: 200, data: postbyId });
  } catch (error) {
    console.error("Error getPost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const updatePost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const postId = req.params.id;
    const { title, description }: PostWriteTypes = req.body;

    const postExist = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExist) return res.json({ status: 400, message: "Post not found" });
    if (!title || !description)
      return res.json({ status: 400, message: "Post Incomplete" });

    const updateUserById = await prisma.post.update({
      where: { id: postId },
      data: { title, description, datePostPublished: new Date() },
    });

    return res.json({
      status: 200,
      data: updateUserById,
      message: "Post Updated",
    });
  } catch (error) {
    console.error("Error updateUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const deleterPost = async (
  req: express.Request,
  res: express.Response
) => {
  const postId = req.params.id;

  try {
    const postExist = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      include : {
        comments: true,
      },
    });

    if (!postExist) return res.json({ status: 400, message: "Post not found" });

    // Delete Comment On Cascade
    const commentIds = postExist.comments.map((comment) => comment.id);
    await prisma.comment.deleteMany({
      where: {
        id: {
          in: commentIds,
        },
      },
    });

    await prisma.post.deleteMany({
      where: { id: postId },
    });

    return res.json({ status: 200, message: "Post Deleted" });
  } catch (error) {
    console.error("Error deleterComment:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};
