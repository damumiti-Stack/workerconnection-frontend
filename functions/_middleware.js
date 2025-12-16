export async function onRequest(context) {
  const req = context.request;
  const url = new URL(req.url);
  const BACKEND_ORIGIN = "https://workerconnection-backend.onrender.com";

  const isApi = url.pathname.startsWith("/api/");
  const isSaml = url.pathname.startsWith("/saml/");

  if (!isApi && !isSaml) {
    return context.next();
  }

  const targetUrl = new URL(BACKEND_ORIGIN);
  targetUrl.pathname = url.pathname;
  targetUrl.search = url.search;

  const init = {
    method: req.method,
    headers: req.headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.clone().body;
  }

  return fetch(targetUrl.toString(), init);
}