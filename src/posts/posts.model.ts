import * as mongoose from "mongoose";
import IPost from "./posts.interface";

// Author is one to many or 1:N relationship

const postSchema = new mongoose.Schema({
    author: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    content: String,
    title: String
});

const postModel = mongoose.model<IPost & mongoose.Document>("Post", postSchema)

export default postModel;
