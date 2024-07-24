import { IndexType, Permission } from "node-appwrite"

import {db, questionCollection} from "../name"
import { databses } from "./config"

export default async function createQuestionCollection() {
    // create collection
    await databses.createCollection(db, questionCollection, questionCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("Question collection is created")

    // creating attributes and Indexes

    await Promise.all([
        databses.createStringAttribute(db, questionCollection, "title", 100, true),
        databses.createStringAttribute(db, questionCollection, "content", 10000, true),
        databses.createStringAttribute(db, questionCollection, "authorId", 50, true),
        databses.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true),
        databses.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
    ])
    console.log("Question Attributes created");
    
    // create Indexes
    await Promise.all([
        databses.createIndex(db, questionCollection, "title", IndexType.Fulltext, ["title"], ["asc"]),
        databses.createIndex(db, questionCollection, "content", IndexType.Fulltext, ["content"], ["asc"]),
    ])
}