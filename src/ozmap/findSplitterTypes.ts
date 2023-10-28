import * as configurations from "../configurations";

interface Result {
  total: number;
  count: number;
  rows: Array<{
    isBalanced: boolean;
    prefix: string;
    attenuation: number[];
    code: string;
    brand: string;
    mold: string;
    description: string;
    isDrop: boolean;
    ratio: { output: number; input: number };
    inputConnectionType: number;
    outputConnectionType: number;
    createdAt: string;
    updatedAt: string;
    id: string;
  }>;
  start: number;
  limit: number;
}

export default async function findSplitterTypes(): Promise<Result> {
  const response = await fetch(
    `${configurations.OZMAP_API_BASE_URL}/splitter-types`,
    {
      headers: {
        authorization: configurations.OZMAP_API_KEY,
        accept: "application/json",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Request failed with status code ${response.status}`);
  }

  return await response.json();
}
