import * as axios from "../axios";
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
  coords: [number, number];
  observation?: string | undefined;
  lat?: number | null | undefined;
  lng?: number | null | undefined;
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
  createdAt: string | null;
  updatedAt: string | null;
  __v: number;
  id: string;
  lng: number;
  lat: number;
}

export default async function createBox(params: Params): Promise<Result> {
  const response = await axios.instance.request<Result>({
    method: "POST",
    url: `${configurations.OZMAP_API_BASE_URL}/boxes`,
    data: params,
    headers: {
      authorization: configurations.OZMAP_API_KEY,
      accept: "application/json",
    },
  });

  return response.data;
}
