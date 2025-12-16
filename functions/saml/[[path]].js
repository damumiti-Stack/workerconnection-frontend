
export async function onRequest(context) {
  const req = context.request;
  const url = new URL(req.url);

  const BACKEND_ORIGIN = "https://workerconnection-backend.onrender.com";

  const targetUrl = new URL(BACKEND_ORIGIN);
  targetUrl.pathname = url.pathname; // keeps /saml/...
  targetUrl.search = url.search;

  const headers = new Headers(req.headers);
  headers.set("host", targetUrl.host);

  const init = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.clone().body;
  }

  return fetch(targetUrl.toString(), init);
}
