import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databses, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    // grab the data
    const { votedById, voteStatus, type, typeId } = await request.json();
    // list-document
    const response = await databses.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);

    console.log("Response in vote route: ", response);

    if (response.documents.length > 0) {
      await databses.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );

      // Decrease the reputation of the question/answer author
      const questionOrAnswer = await databses.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        questionOrAnswer.authorId
      );

      await users.updatePrefs(questionOrAnswer.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }

    // that means prev vote does not exists or vote status changes
    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databses.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteStatus,
          votedById,
        }
      );

      // Increase/Decrease the reputation of the question/answer author accordingly
      const questionOrAnswer = await databses.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );

      const authorPrefs = await users.getPrefs<UserPrefs>(
        questionOrAnswer.authorId
      );

      // if vote was present
      if (response.documents[0]) {
        await users.updatePrefs<UserPrefs>(questionOrAnswer.authorid, {
          reputation:
            // that means prev vote was "upvoted" ans new value is "downvoted" so we have to decrease the reputation
            response.documents[0].voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
        });
      } else {
        await users.updatePrefs<UserPrefs>(questionOrAnswer.authorid, {
          reputation:
            // that means prev vote was "downvoted" ans new value is "upvoted" so we have to decrease the reputation
            voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) + 1
              : Number(authorPrefs.reputation) - 1,
        });
      }
    }

    const [upvotes, downvotes] = await Promise.all([
      databses.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1), // for optimization as we only need total
      ]),
      databses.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: { document: null, voteResult: upvotes.total - downvotes.total },
        message: response.documents[0] ? "Vote status Updated" : "Voted",
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error in voting",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}