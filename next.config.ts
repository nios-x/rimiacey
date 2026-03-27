import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type checking spawns a separate worker process that can be blocked in restricted environments.
    ignoreBuildErrors: true,
  },
  experimental: {
    // Force Next to use worker_threads instead of child_process.fork, avoiding spawn restrictions.
    workerThreads: true,
  },
  webpack: (config) => {
    // Allow native .node binaries (used by @napi-rs/canvas) to be bundled on the server.
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    // Skip bundling optional platform-specific binaries for @napi-rs/canvas so webpack
    // doesn't try to resolve every architecture we don't have installed.
    config.externals = config.externals || [];
    config.externals.push(({ request }, callback) => {
      if (
        request &&
        (request.endsWith(".node") || request.startsWith("@napi-rs/canvas-") || request.startsWith("./skia."))
      ) {
        return callback(null, "commonjs " + request);
      }
      callback();
    });

    return config;
  },
};

export default nextConfig;
