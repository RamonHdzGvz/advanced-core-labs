export function withCors(
  req: Request,
  handler: () => Promise<Response>
) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
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
    } catch (err) {
      console.error("[EdgeFunctionError]", err);

      return new Response(
        JSON.stringify({
          message:
            err instanceof Error ? err.message : "Unexpected error",
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  })();
}
