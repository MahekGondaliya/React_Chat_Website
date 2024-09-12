import axios from "axios";
import { HOST } from "@/utils/constants";

export const apiclient = axios.create({
    baseURL:HOST,
});

  