import axios from "axios";

const instance = axios.create();

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (typeof error.response?.data === "string") {
        throw new Error(error.response.data);
      }
    }

    throw error;
  }
);

export { instance };
