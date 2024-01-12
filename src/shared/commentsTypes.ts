import { PostWriteTypes } from "./postsTypes";

  export type CommentReadTypes = {
    id: string;
    comment: string;
    dateCommentPublished: Date;
    updatedAt: Date;
    post?: PostWriteTypes;
  };
  
  export type CommentWriteTypes = {
    comment: string;
    dateCommentPublished: Date;
    postId: String;
    updatedAt: Date;
  };


