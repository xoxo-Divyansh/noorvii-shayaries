import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), "..");
const envPath = path.join(projectRoot, ".env.local");
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

function loadEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function runCommand(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      ...options.env,
    },
  });
}

function printStep(message) {
  process.stdout.write(`\n${colors.cyan}${message}${colors.reset}\n`);
}

function printWarning(message) {
  process.stdout.write(`${colors.yellow}${message}${colors.reset}\n`);
}

function printError(message) {
  process.stderr.write(`${colors.red}${message}${colors.reset}\n`);
}

function printSuccess(message) {
  process.stdout.write(`${colors.green}${message}${colors.reset}\n`);
}

function ensureSuccess(result, failureMessage, hints = []) {
  if (result.status === 0) {
    return;
  }

  printError(failureMessage);
  for (const hint of hints) {
    printWarning(`- ${hint}`);
  }
  process.exit(result.status ?? 1);
}

if (!fs.existsSync(envPath)) {
  printError("`.env.local` not found. Create it with MONGODB_URI and MONGODB_DB first.");
  process.exit(1);
}

loadEnvFile(envPath);

const { MONGODB_URI, MONGODB_DB } = process.env;
const args = new Set(process.argv.slice(2));
const seedOnly = args.has("seed-only") || args.has("--seed-only");

if (!MONGODB_URI || !MONGODB_DB) {
  printError("MONGODB_URI or MONGODB_DB is missing in `.env.local`.");
  process.exit(1);
}

if (MONGODB_URI.startsWith("mongodb+srv://")) {
  printWarning(
    "Warning: using an SRV Mongo URI (mongodb+srv://). If Atlas DNS fails on this machine, switch to the exact non-SRV URI from Atlas."
  );
} else if (MONGODB_URI.startsWith("mongodb://")) {
  printSuccess("Using a standard non-SRV Mongo URI.");
} else {
  printWarning(
    "MONGODB_URI does not start with mongodb:// or mongodb+srv://. Double-check the connection string."
  );
}

printStep("1. Seeding MongoDB from the current local content...");
ensureSuccess(
  runCommand("npm", ["run", "db:seed"]),
  "Database seed failed.",
  [
    "Check Atlas Network Access and ensure your current IP is allowed.",
    "If you are using mongodb+srv and DNS/SRV resolution has failed before, switch to the exact non-SRV URI from Atlas.",
    "Verify the username, password, replica set, and hostnames in `.env.local` are copied exactly from Atlas.",
  ]
);
printSuccess("Database seed completed.");

if (seedOnly) {
  printWarning("Skipping lint/build checks because seed-only mode was requested.");
  process.exit(0);
}

printStep("2. Running lint...");
ensureSuccess(runCommand("npm", ["run", "lint"]), "Lint failed after database setup.");
printSuccess("Lint passed.");

printStep("3. Running production build verification...");
ensureSuccess(
  runCommand("npm", ["run", "build"], {
    env: {
      NODE_ENV: "production",
    },
  }),
  "Production build verification failed."
);

printSuccess("Database setup and production verification both passed.");
