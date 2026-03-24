import dns from "node:dns/promises";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

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

function printInfo(message) {
  process.stdout.write(`${colors.cyan}${message}${colors.reset}\n`);
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

function getSrvHost(uri) {
  return uri.replace(/^mongodb\+srv:\/\//, "").split("/")[0].split("@").pop();
}

function getStandardHosts(uri) {
  const authority = uri.replace(/^mongodb:\/\//, "").split("/")[0];
  const hostList = authority.includes("@") ? authority.split("@").pop() : authority;

  return hostList
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean)
    .map((host) => host.replace(/:\d+$/, ""));
}

async function main() {
  if (!fs.existsSync(envPath)) {
    printError("`.env.local` not found. Add MONGODB_URI and MONGODB_DB first.");
    process.exit(1);
  }

  loadEnvFile(envPath);

  const { MONGODB_URI, MONGODB_DB } = process.env;

  if (!MONGODB_URI || !MONGODB_DB) {
    printError("MONGODB_URI or MONGODB_DB is missing in `.env.local`.");
    process.exit(1);
  }

  printInfo(`Node version: ${process.version}`);
  printInfo(`Database name: ${MONGODB_DB}`);

  if (MONGODB_URI.startsWith("mongodb+srv://")) {
    const srvHost = getSrvHost(MONGODB_URI);

    printWarning("Detected SRV MongoDB URI. Checking Atlas SRV DNS records...");
    printInfo(`SRV host: ${srvHost}`);

    try {
      const records = await dns.resolveSrv(`_mongodb._tcp.${srvHost}`);
      printSuccess(`SRV lookup passed. Found ${records.length} record(s).`);
      for (const record of records) {
        printInfo(`- ${record.name}:${record.port} priority=${record.priority} weight=${record.weight}`);
      }
    } catch (error) {
      printError(`SRV lookup failed: ${error.code ?? error.message}`);
      printWarning("This usually means local DNS, ISP, VPN, or firewall issues are blocking Atlas SRV resolution.");
      printWarning("Try the exact non-SRV connection string from Atlas, or test from a different network/hotspot.");
      process.exit(1);
    }

    return;
  }

  if (!MONGODB_URI.startsWith("mongodb://")) {
    printError("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
    process.exit(1);
  }

  const hosts = getStandardHosts(MONGODB_URI);

  if (hosts.length === 0) {
    printError("Could not parse any MongoDB hosts from MONGODB_URI.");
    process.exit(1);
  }

  printSuccess(`Detected standard MongoDB URI with ${hosts.length} host(s).`);

  let failed = false;

  for (const host of hosts) {
    printInfo(`Checking DNS lookup for ${host}...`);

    try {
      const result = await dns.lookup(host, { all: true });
      const addresses = result.map((entry) => entry.address).join(", ");
      printSuccess(`Resolved ${host} -> ${addresses}`);
    } catch (error) {
      failed = true;
      printError(`DNS lookup failed for ${host}: ${error.code ?? error.message}`);
    }
  }

  if (failed) {
    printWarning("One or more Atlas shard hostnames could not be resolved from this machine.");
    printWarning("Next steps: flush DNS, try a different network or hotspot, check VPN/firewall, and verify the exact non-SRV URI from Atlas.");
    process.exit(1);
  }

  printSuccess("All Atlas hostnames resolved successfully.");
}

await main();