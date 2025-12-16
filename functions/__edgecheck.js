export async function onRequest() {
  return new Response("EDGE_OK", {
    headers: { "content-type": "text/plain" },
  });
}