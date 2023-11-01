import * as axios from "../axios";
import * as configurations from "../configurations";

interface Result {
  total: number;
  count: number;
  rows: Array<{
    area: { coordinates: [number, number][][]; type: string };
    lat: number;
    lng: number;
    name: string;
    drop: { defaults: { cableType: string }; maxSize: number };
    defaultPonPotency: null;
    createdAt: string;
    updatedAt: string;
    parents: Array<{ project: string }>;
    hasLogo: boolean;
    id: string;
    hierarchyLevels: {
      box: {
        POP: number;
        CE: number;
        CTO: number;
      };
      cable: {
        PRIMÁRIO: number;
        SECUNDÁRIO: number;
        TERCIÁRIO: number;
        DROP: number;
      };
    };
  }>;
  start: number;
  limit: number;
}

export default async function findProjects(): Promise<Result> {
  const response = await axios.instance.request<Result>({
    url: `${configurations.OZMAP_API_BASE_URL}/projects`,
    headers: {
      authorization: configurations.OZMAP_API_KEY,
      accept: "application/json",
    },
  });

  return response.data;
}
