
export async function onRequest(context: any) {
  const { request, env } = context;

  const backend = env.BACKEND_ORIGIN;
  if (!backend) {
    return new Response("Missing BACKEND_ORIGIN env var", { status: 500 });
  }

  const url = new URL(request.url);
  const targetUrl = new URL(url.pathname + url.search, backend);

  const headers = new Headers(request.headers);
  headers.set("Cache-Control", "no-store");

  const resp = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
  });

  const outHeaders = new Headers(resp.headers);
  outHeaders.set("Cache-Control", "no-store");

  return new Response(resp.body, {
    status: resp.status,
    headers: outHeaders,
  });
}
