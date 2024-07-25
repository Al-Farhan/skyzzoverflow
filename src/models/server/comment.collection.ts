import { Permission } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databses } from "./config";

export default async function createCommentCollection() {
    // creating Collection
    await databses.createCollection(db, commentCollection, commentCollection, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("Comment Collection Created");

    // creating Attributes
    await Promise.all([
        databses.createStringAttribute(db, commentCollection, "content", 10000, true),
        databses.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true),
        databses.createStringAttribute(db, commentCollection, "typeId", 50, true),
        databses.createStringAttribute(db, commentCollection, "authorId", 50, true),
    ])
    console.log("Comment Attribute Created");
    
}