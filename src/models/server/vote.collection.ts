import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databses } from "./config";

export default async function createVoteCollection() {
    // creating Collection
    await databses.createCollection(db, voteCollection, voteCollection, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Vote Collection Created");
    
    // creating Attributes
    await Promise.all([
        databses.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true),
        databses.createStringAttribute(db, voteCollection, "typeId", 50, true),
        databses.createEnumAttribute(db, voteCollection, "voteStatus", ["upvoted", "downvoted"], true),
        databses.createStringAttribute(db, voteCollection, "voteById", 50, true),
    ]);
    console.log("Vote Attributes Created");
    
}