import * as mongoose from "mongoose";
import IUser from "./user.interface";

const addressSchema = new mongoose.Schema({
    city: String,
    street: String,
    country: String
})
// 1:1 relationship
const userSchema = new mongoose.Schema({
    address: addressSchema,
    name: String,
    username: String,
    email: String,
    password: String

})

const userModel = mongoose.model<IUser & mongoose.Document>("User", userSchema)

export default userModel;
