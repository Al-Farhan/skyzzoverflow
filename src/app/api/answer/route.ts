import { answerCollection, db } from "@/models/name";
import { databses, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();

    const response = await databses.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId: authorId,
        questionId: questionId,
      }
    );

    // Increase author reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId);
    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const answer = await databses.getDocument(db, answerCollection, answerId);
    // TODO: check whether answer is present or not

    const response = await databses.deleteDocument(
      db,
      answerCollection,
      answerId
    );

    // Decrease the reputation
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
    await users.updatePrefs(answer.authorID, {
      reputation: Number(prefs.reputation) - 1,
    });

    return NextResponse.json(
      { data: response },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error deleting the answer",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}