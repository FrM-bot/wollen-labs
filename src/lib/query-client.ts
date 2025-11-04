'use client'
import QueryFactory from "./query-factory";
import { env } from "../config/env.client";

export const query = new QueryFactory(env.NEXT_PUBLIC_APP_DOMAIN)
