import type { APIRoute } from "astro";
import { generateLlmsTxt } from "../utils/llms";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(generateLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
