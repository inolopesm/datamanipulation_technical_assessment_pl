import * as configurations from "../configurations";

interface Params {
  [x: string]: unknown;
}

interface Result {
  [x: string]: unknown;
}

export default async function createSplitter(params: Params): Promise<Result> {
  const response = await fetch(`${configurations.OZMAP_API_BASE_URL}/boxes`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      authorization: configurations.OZMAP_API_KEY,
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  if (response.status !== 201) {
    throw new Error(`Request failed with status code ${response.status}`);
  }

  return await response.json();
}
