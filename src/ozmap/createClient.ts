import * as configurations from "../configurations";

interface Params {
  certified?: boolean;
  status: 0 | 1;
  observation?: string;
  tags?: string[];
  implanted?: boolean;
  onu: {
    serial_number: string;
    user_PPPoE: string;
    mac_address: string;
  } | null;
  kind?: string;
  code: string;
}

interface Result {
  certified: boolean;
  status: number;
  observation: string;
  tags: string[];
  implanted: boolean;
  onu: {
    serial_number: string;
    user_PPPoE: string;
    mac_address: string;
  } | null;
  kind: string;
  code: string;
  creatorData: { id: string; name: string; username: string };
  createdAt: string | null;
  updatedAt: string | null;
  id: string;
}

export default async function createClient(params: Params): Promise<Result> {
  const response = await fetch(
    `${configurations.OZMAP_API_BASE_URL}/ftth-clients`,
    {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        authorization: configurations.OZMAP_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
      },
    }
  );

  if (response.status !== 201) {
    throw new Error(`Request failed with status code ${response.status}`);
  }

  return await response.json();
}
