import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withCors } from "../_shared/cors.ts";
import { newJsonResponse, newMessageResponse } from "../_shared/responses.ts";

function sha1(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  return crypto.subtle.digest("SHA-1", data).then((hash) =>
    Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
}

Deno.serve((req) =>
  withCors(req, async () => {
    if (req.method !== "POST") {
      return newMessageResponse("Method not allowed", 405);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return newMessageResponse("A valid JSON body is required", 400);
    }

    const folder =
      typeof body === "object" && body !== null && "folder" in body
        ? body.folder
        : undefined;

    if (
      typeof folder !== "string" ||
      folder.length > 255 ||
      !/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(folder)
    ) {
      return newMessageResponse("A valid Cloudinary folder is required", 400);
    }

    const allowedFolders = (Deno.env.get("CLOUDINARY_ALLOWED_FOLDERS") ?? "")
      .split(",")
      .map((allowedFolder) => allowedFolder.trim())
      .filter(Boolean);

    if (!allowedFolders.length) {
      console.error("Cloudinary allowed folders are not configured");
      return newMessageResponse("Cloudinary folders are not configured", 500);
    }

    if (!allowedFolders.includes(folder)) {
      return newMessageResponse("This Cloudinary folder is not allowed", 400);
    }

    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");

    if (!apiSecret || !apiKey || !cloudName) {
      console.error("Cloudinary environment is not configured");
      return newMessageResponse("Cloudinary is not configured", 500);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await sha1(`folder=${folder}&timestamp=${timestamp}${apiSecret}`);

    return newJsonResponse({ timestamp, signature, apiKey, cloudName, folder });
  })
);
