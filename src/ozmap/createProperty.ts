import * as axios from "../axios";
import * as configurations from "../configurations";

interface Params {
  address: string;
  box?: string;
  coords: [number | null, number | null];
  observation?: string;
  pole?: string;
  project: string;
  connector?: string;
  port?: number;
  drop_poles?: string[];
  client?:
    | string
    | {
        certified?: boolean;
        implanted?: boolean;
        status?: number;
        observation?: string;
        code: string;
      };
  auto_connect?: boolean;
  force?: boolean;
}

interface Result {
  history: {
    clients: Array<{
      id: string;
      code: string;
      enter_date: string | null;
      exit_date: string | null;
    }>;
  };
  observation: string;
  drop: string | null; // null value founded inside docs examples
  tags: string[];
  cables: string[];
  kind: string;
  coords: [number | null, number | null];
  project: string;
  creatorData: { id: string; name: string; username: string };
  createdAt: string | null;
  updatedAt: string | null;
  id: string;
  lng: number | null;
  lat: number | null;
}

export default async function createProperty(params: Params): Promise<Result> {
  const response = await axios.instance.request<Result>({
    url: `${configurations.OZMAP_API_BASE_URL}/properties`,
    method: "POST",
    data: params,
    headers: {
      authorization: configurations.OZMAP_API_KEY,
      accept: "application/json",
    },
  });

  return response.data;
}
