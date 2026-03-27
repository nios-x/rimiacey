const cp = require("child_process");
const originalSpawn = cp.spawn;
const originalSpawnSync = cp.spawnSync;
const originalExecFile = cp.execFile;
const originalExecFileSync = cp.execFileSync;
const originalFork = cp.fork;

cp.spawn = function (...args) {
  console.error("SPAWN", args[0], args[1] || []);
  try {
    const child = originalSpawn.apply(this, args);
    child.on("error", (err) => {
      console.error("SPAWN_ERR", args[0], err.code || err.message);
    });
    return child;
  } catch (err) {
    console.error("SPAWN_THROW", args[0], err.code || err.message);
    throw err;
  }
};

cp.spawnSync = function (...args) {
  console.error("SPAWN_SYNC", args[0], args[1] || []);
  return originalSpawnSync.apply(this, args);
};

cp.execFile = function (...args) {
  console.error("EXECFILE", args[0], args[1] || []);
  return originalExecFile.apply(this, args);
};

cp.execFileSync = function (...args) {
  console.error("EXECFILE_SYNC", args[0], args[1] || []);
  return originalExecFileSync.apply(this, args);
};

cp.fork = function (...args) {
  console.error("FORK", args[0], args[1] || []);
  return originalFork.apply(this, args);
};

process.argv = ["node", "next", "build", "--webpack"];
require("./node_modules/next/dist/bin/next");
