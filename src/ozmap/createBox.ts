import * as configurations from "../configurations";

interface Params {
  project: string;
  draft?: boolean | undefined;
  implanted: boolean;
  certified?: boolean | undefined;
  hierarchyLevel: number;
  template?: string | undefined;
  boxType: string;
  name?: string | undefined;
  coords: [number | null, number | null];
  observation?: string | undefined;
  lat?: string | null | undefined;
  lng?: string | null | undefined;
  pole?: string | undefined;
  tags?: string[] | undefined;
}

interface Result {
  shared: boolean;
  draft: boolean;
  default_reserve: number;
  certified: boolean;
  _id: string;
  tags: string[];
  coords: [number | null, number | null];
  cables: string[];
  kind: string;
  project: string;
  implanted: bigint;
  hierarchyLevel: number;
  boxType: string;
  name: string;
  creatorData: { id: string; name: string; username: string };
  pole: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  lng: number;
  lat: number;
}

export default async function createBox(params: Params): Promise<Result> {
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
