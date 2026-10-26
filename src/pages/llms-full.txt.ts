import type { APIRoute } from "astro";
import { generateLlmsFullTxt } from "../utils/llms";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(generateLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
