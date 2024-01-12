/* Component  */
import prisma from "../config/db.config";
import { CreateUserTypes } from "shared/usersTypes";

/* Npm  */
import express from "express";
import bcrypt from "bcrypt";
import chalk from "chalk"; // @4.1.2

const info = chalk.bold.blue;
const error = chalk.bgRed;

export const getPosts = async (req: express.Request, res: express.Response) => {
    try {

        
    } catch (error) {
        console.error("Error getPost:", error);
        return res
            .status(500)
            .json({ status: 500, message: "Internal Server Error" });
        }
};