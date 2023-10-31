import { URLSearchParams } from "node:url";

interface Params {
  results?: number;
  nat?: string;
}

interface Result {
  info: { seed: string; results: number; page: number; version: string };
  results: Array<{
    gender: string;
    name: { title: string; first: string; last: string };
    email: string;
    dob: { date: string; age: number };
    registered: { date: string; age: number };
    phone: string;
    cell: string;
    id: { name: string; value: string };
    picture: { large: string; medium: string; thumbnail: string };
    nat: string;
    location: {
      street: { number: number; name: string };
      city: string;
      state: string;
      country: string;
      postcode: string;
      coordinates: { latitude: string; longitude: string };
      timezone: { offset: string; description: string };
    };
    login: {
      uuid: string;
      username: string;
      password: string;
      salt: string;
      md5: string;
      sha1: string;
      sha256: string;
    };
  }>;
}

export default async function generate(params: Params = {}): Promise<Result> {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        typeof value === "number" ? value.toString() : value,
      ])
    )
  );

  const response = await fetch(`https://randomuser.me/api?${query}`);

  if (response.status !== 200) {
    throw new Error(`Request failed with status code ${response.status}`);
  }

  return await response.json();
}
