import * as mongo from "mongodb";
import * as configurations from "./configurations";

export const client = new mongo.MongoClient(configurations.MONGO_URL);
