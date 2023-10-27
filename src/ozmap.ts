import * as configurations from "./configurations";

export async function findProjects(): Promise<{
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
}> {
  const response = await fetch(
    `${configurations.OZMAP_API_BASE_URL}/projects`,
    {
      headers: {
        authorization: configurations.OZMAP_API_KEY,
        accept: "application/json",
      },
    }
  );

  if (response.status === 422) {
    throw new Error("Unprocessable entity");
  }

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (response.status !== 200) {
    throw new Error(`Request failed with status code ${response.status}`);
  }

  return await response.json();
}
