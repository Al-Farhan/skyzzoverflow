import { IndexType, Permission } from "node-appwrite";
import { answerCollection, db } from "../name";
import { databses } from "./config";

export default async function createAnswerCollection() {
  // creating collection
  await databses.createCollection(db, answerCollection, answerCollection, [
    Permission.read("any"),
    Permission.create("users"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Answer collection Created");

  // creating Attributes
  await Promise.all([
    databses.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true
    ),
    databses.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      50,
      true
    ),
    databses.createStringAttribute(db, answerCollection, "authorId", 50, true),
  ]);
  console.log("Answer Attributes Created");
}
