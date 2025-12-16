export async function onRequest(context: any) {
  const { request, env, next } = context;

  const backend = env.BACKEND_ORIGIN;
  if (!backend) return new Response("Missing BACKEND_ORIGIN", { status: 500 });

  const url = new URL(request.url);

  // Only proxy these two prefixes; everything else behaves exactly the same as today
  const shouldProxy =
    url.pathname.startsWith("/saml/") || url.pathname.startsWith("/api/");

  if (!shouldProxy) {
    return next();
  }

  const targetUrl = new URL(url.pathname + url.search, backend);

  const headers = new Headers(request.headers);
  headers.set("Cache-Control", "no-store");

  const resp = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    redirect: url.pathname.startsWith("/saml/") ? "manual" : "follow",
  });

  const outHeaders = new Headers(resp.headers);
  outHeaders.set("Cache-Control", "no-store");

  return new Response(resp.body, { status: resp.status, headers: outHeaders });
}
