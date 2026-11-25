export function newJsonResponse(content: unknown = {}, status = 200): Response {
  return new Response(JSON.stringify(content) ?? "{}", {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function newMessageResponse(message: string, status = 200): Response {
  return newJsonResponse({ message }, status);
}

export function newPdfResponse(
  filename: string,
  safePdfBytes: Uint8Array<ArrayBuffer>
): Response {
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(safePdfBytes);
        controller.close();
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    }
  );
}
