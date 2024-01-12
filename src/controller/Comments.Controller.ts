/* Component  */
import prisma from "../config/db.config";
import { CommentReadTypes, CommentWriteTypes } from "shared/commentsTypes";

/* Npm  */
import express from "express";
import chalk from "chalk"; // @4.1.2

const info = chalk.bold.blue;
const error = chalk.bgRed;

export const getComments = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        comment: true,
        dateCommentPublished: true,
        post: {
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
        },
      },
    });

    return res.json({ status: 200, data: comments });
  } catch (error) {
    console.error("Error getComments:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const getCommentById = async (
  req: express.Request,
  res: express.Response
) => {
  const commentId = req.params.id;
  try {
    const comments: CommentReadTypes = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    return res.json({ status: 200, data: comments });
  } catch (error) {
    console.error("Error getComments:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const createComment = async (
  req: express.Request,
  res: express.Response
) => {
  const postId = req.params.id;
  const { comment }: CommentWriteTypes = req.body;
  console.log("comment", comment);

  try {
    const getPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!getPost) throw new Error("Post not found");

    if (!comment)
      return res.json({ status: 400, message: "Comment Incomplete" });

    const newComment = await prisma.comment.create({
      data: {
        comment,
        dateCommentPublished: new Date(),
        post: {
          connect: { id: postId },
        },
      },
      select: {
        id: true,
        comment: true,
        dateCommentPublished: true,
        post: {
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
        },
      },
    });

    return res.json({
      status: 200,
      data: newComment,
      message: "Comment created",
    });
  } catch (error) {
    console.error("Error createPost:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const updateComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const commentId = req.params.id;
    const { comment }: CommentWriteTypes = req.body;

    const commentExist = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment)
      return res.json({ status: 400, message: "Comment Incomplete" });
    if (!commentExist)
      return res.json({ status: 400, message: "Comment not found" });

    const updateCommentById = await prisma.comment.update({
      where: { id: commentId },
      data: { comment, dateCommentPublished: new Date() },
    });

    return res.json({
      status: 200,
      data: updateCommentById,
      message: "Post Updated",
    });
  } catch (error) {
    console.error("Error updateUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const deleterComment = async (
  req: express.Request,
  res: express.Response
) => {
  const commentId = req.params.id;

  try {
    const commentExist = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },

    });

    if (!commentExist)
      return res.json({ status: 400, message: "Comment not found" });

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.json({ status: 200, message: "Comment Deleted" });
  } catch (error) {
    console.error("Error deleterComment:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};
