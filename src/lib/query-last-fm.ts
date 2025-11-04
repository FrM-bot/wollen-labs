import QueryFactory from "./query-factory";
import { env } from "@/config/env.server";

export const query = new QueryFactory(
  "https://ws.audioscrobbler.com/2.0"
).addParams({
  api_key: env.LAST_FM_API_KEY,
});
