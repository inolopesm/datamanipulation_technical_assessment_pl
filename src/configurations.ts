import * as process from "node:process";

const MONGO_URL = process.env.MONGO_URL as string;
const OZMAP_API_KEY = process.env.OZMAP_API_KEY as string;
const OZMAP_API_BASE_URL = process.env.OZMAP_API_BASE_URL as string;

if (MONGO_URL === undefined) {
  throw new Error("MONGO_URL is a required field");
}

if (OZMAP_API_KEY === undefined) {
  throw new Error("OZMAP_API_KEY is a required field");
}

if (OZMAP_API_BASE_URL === undefined) {
  throw new Error("OZMAP_API_BASE_URL is a required field");
}

export { MONGO_URL, OZMAP_API_KEY, OZMAP_API_BASE_URL };
