

export async function onRequest(context: any) {
  const { request, env } = context;

  const backend = env.BACKEND_ORIGIN; // e.g. https://workerconnectbackend.onrender.com
  if (!backend) {
    return new Response("Missing BACKEND_ORIGIN env var", { status: 500 });
  }

  const url = new URL(request.url);

  // keep the same path + query, just switch origin to backend
  const targetUrl = new URL(url.pathname + url.search, backend);

  // clone headers and ensure we don't accidentally cache auth redirects
  const headers = new Headers(request.headers);
  headers.set("Cache-Control", "no-store");

  // Forward the request as-is (method/body), including cookies
  const resp = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    redirect: "manual", // important: don't auto-follow IdP redirects at the edge
  });

  // Pass response back as-is (including Set-Cookie)
  const outHeaders = new Headers(resp.headers);
  outHeaders.set("Cache-Control", "no-store");

  return new Response(resp.body, {
    status: resp.status,
    headers: outHeaders,
  });
}
