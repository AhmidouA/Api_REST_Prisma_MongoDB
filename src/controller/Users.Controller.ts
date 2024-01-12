/* Component  */
import prisma from "../config/db.config";
import { CreateUserTypes } from "shared/usersTypes";

/* Npm  */
import express from "express";
import bcrypt from "bcrypt";
import chalk from "chalk"; // @4.1.2

const info = chalk.bold.blue;
const error = chalk.bgRed;

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        city: true,
        zip: true,
        posts: {
          select: {
            title: true,
            description: true,
            datePostPublished: true,
          },
        },
      },
    });

    return res.json({ status: 200, data: users });
  } catch (error) {
    console.error("Error getUSers:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const getUserById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.params.id;

    const getOneUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        city: true,
        zip: true,
      },
    });
    if (!getOneUser) {
      return res.status(400).json("User could not be found");
    }

    return res.json({ status: 200, data: getOneUser });
  } catch (error) {
    console.error("Error getUserById:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { email, name, password, address, city, zip }: CreateUserTypes =
    req.body;

  try {
    if (!email)
      return res.json({ status: 400, message: "Please Enter Email adress" });

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (findUser)
      return res.json({
        status: 400,
        message: "Email Already Taken, Please choose another email",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        address,
        city,
        zip,
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        city: true,
        zip: true,
      },
    });
    return res.json({ status: 200, data: newUser, message: "User created" });
  } catch (error) {
    console.error("Error getUsers:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.params.id;
    const { email, name, password, address, city, zip }: CreateUserTypes =
      req.body;

    const userExist = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExist) return res.json({ status: 400, message: "User not found" });

    const updateUserById = await prisma.user.update({
      where: { id: userId },
      data: { email, name, password, address, city, zip },
    });

    return res.json({
      status: 200,
      data: updateUserById,
      message: "User Updated",
    });
  } catch (error) {
    console.error("Error updateUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

export const deleterUser = async (
  req: express.Request,
  res: express.Response
) => {
  const userId = req.params.id;

  try {
    const userExist = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
      },
    });

    if (!userExist) return res.json({ status: 400, message: "User not found" });

    // delete on cascade (Before Comment)
    const postIds = userExist.posts.map((post) => post.id);
    const commentIds = userExist.posts.reduce((acc, post) => {
      return acc.concat(post.comments.map((comment) => comment.id));
    }, []);

    await prisma.comment.deleteMany({
      where: {
        id: {
          in: commentIds,
        },
      },
    });

    // After Posts
    await prisma.post.deleteMany({
      where: {
        id: {
          in: postIds,
        },
      },
    });

    // Finally
    await prisma.user.delete({
      where: { id: userId },
    });

    return res.json({ status: 200, message: "User and related data deleted" });
  } catch (error) {
    console.error("Error deleterUser:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};
