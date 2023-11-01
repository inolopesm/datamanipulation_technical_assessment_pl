import * as axios from "../axios";
import * as configurations from "../configurations";

interface Params {
  implanted: boolean;
  isDrop: boolean;
  parent: string;
  project: string;
  name: string;
  splitterType: string;
  ratio: { output: number; input: number; }
  // ? can be more? document page not found
}

interface Result {
  total: number;
  counter: number;
  rows: Array<{
    isBalanced: boolean;
    orientation: string;
    currentPower: Array<number | null>;
    installPower: Array<number | null>;
    label: string;
    attenuation: Array<number | null>;
    implanted: boolean | null;
    isDrop: boolean;
    kind: string;
    parent: string;
    project: string
    name: string
    splitterType: string
    connectables: { input: string[]; output: string[] };
    ratio: { output: number; input: number; };
    createdAt: string | null;
    updatedAt: string | null;
    id: string;
  }>;
  start: number;
  limit: number;
}

export default async function createSplitter(params: Params): Promise<Result> {
  const response = await axios.instance.request<Result>({
    url: `${configurations.OZMAP_API_BASE_URL}/boxes`,
    method: "POST",
    data: params,
    headers: {
      authorization: configurations.OZMAP_API_KEY,
      accept: "application/json",
    },
  });

  return response.data;
}
