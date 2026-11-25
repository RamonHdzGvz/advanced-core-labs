export function withCors(
  req: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return Promise.resolve(new Response(null, { status: 204, headers: corsHeaders }));
  }

  return (async () => {
    try {
      const response = await handler();
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...corsHeaders,
          ...Object.fromEntries(response.headers),
        },
      });
    } catch (error) {
      console.error("[EdgeFunctionError]", error);
      return new Response(JSON.stringify({ message: "Unexpected error" }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  })();
}
