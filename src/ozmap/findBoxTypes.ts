import * as axios from "../axios";
import * as configurations from "../configurations";

interface Result {
  total: number;
  count: number;
  rows: Array<{
    config: {
      base: { color: string };
      regular: { fillColor: string };
      not_implanted: { fillColor: string };
      draft: { fillColor: string };
    };
    default_reserve: number;
    code: string;
    prefix: string;
    brand: string;
    mold: string;
    description: string;
    default_template: string;
    createdAt: string;
    updatedAt: string;
    default_level: number;
    id: string;
  }>;
  start: number;
  limit: number;
}

export default async function findBoxTypes(): Promise<Result> {
  const response = await axios.instance.request<Result>({
    url: `${configurations.OZMAP_API_BASE_URL}/box-types`,
    headers: {
      authorization: configurations.OZMAP_API_KEY,
      accept: "application/json",
    },
  });

  return response.data;
}
