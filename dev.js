import { spawn } from "node:child_process";

const children = [
  spawn("node", ["server.js", "--api-only"], { stdio: "inherit", env: { ...process.env, API_PORT: "8787" } }),
  spawn("vite", ["--host", "0.0.0.0"], { stdio: "inherit", shell: true })
];

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    for (const child of children) child.kill(signal);
    process.exit(0);
  });
}

for (const child of children) {
  child.on("exit", (code) => {
    if (code && code !== 130 && code !== 143) process.exit(code);
  });
}
