import { CreateUserTypes } from "./usersTypes";

export type PostReadTypes = {
  id: string;
  title: string;
  description: string;
  datePostPublished: Date;
  updatedAt: Date;
  author?: CreateUserTypes;
};

export type PostWriteTypes = {
  title: string;
  description: string;
  datePostPublished: Date;
  authorId: number;
  author: CreateUserTypes;
  updatedAt: Date;
};
