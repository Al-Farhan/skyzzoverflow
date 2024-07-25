import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createQuestionCollection from "./question.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";

import { databses } from "./config";

export default async function getOrCreateDb() {
    try {
        await databses.get(db);
        console.log("Database connected");
    } catch (error) {
        try {
            await databses.create(db, db);
            console.log("Database Created");
            // create collections
            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection()
            ])
            console.log("Collection Created");
            console.log("Database Connected");
            
        } catch (error) {
            console.log("Error creating databases or collection", error);
            
        }
    }

    return databses;
}