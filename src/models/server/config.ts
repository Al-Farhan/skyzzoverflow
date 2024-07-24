import env from "@/app/env";
import { Avatars, Client, Databases, Storage, Users } from "node-appwrite"

let client = new Client();

client
    .setEndpoint(env.appwrite.endpoint) // API Endpoint
    .setProject(env.appwrite.projectId) // Project ID
    .setKey(env.appwrite.apiKey) // Secret API key
;

const databses = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, databses, avatars, storage, users }