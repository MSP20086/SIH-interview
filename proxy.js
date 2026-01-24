import http from "http";
import httpProxy from "http-proxy";

const args = process.argv.slice(2);
const PORT = 8000;

const proxy = httpProxy.createProxyServer({});
const addresses = [
  { host: "localhost", port: 3001 },
  // { host: "localhost", port: 3002 },
  // { host: "localhost", port: 3003 },
];

let i = 0;

const server = http.createServer((req, res) => {
  const target = addresses[i];
  i = (i + 1) % addresses.length;

  const targetUrl = `http://${target.host}:${target.port}`; // <--- changed from https to http
  console.log(`forwarding request to: ${targetUrl}`);

  proxy.web(req, res, { target: targetUrl }, (err) => {
    console.error("proxy error:", err.message);
    res.writeHead(502);
    res.end("Bad gateway");
  });
});

server.listen(PORT, () => {
  console.log(`proxy server started at port ${PORT}`);
});
