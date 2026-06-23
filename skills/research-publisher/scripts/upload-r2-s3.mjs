#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(SCRIPT_DIR, "..");

const MIME_BY_EXT = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const raw = argv[i];

    if (!raw.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${raw}`);
    }

    const [flag, inlineValue] = raw.slice(2).split("=", 2);
    const key = flag.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    if (key === "allowOverwrite" || key === "dryRun") {
      args[key] = true;
      continue;
    }

    const value = inlineValue ?? argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${flag}`);
    }

    args[key] = value;
    if (inlineValue === undefined) {
      i += 1;
    }
  }

  return args;
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
  const equalsIndex = normalized.indexOf("=");
  if (equalsIndex === -1) {
    return null;
  }

  const name = normalized.slice(0, equalsIndex).trim();
  let value = normalized.slice(equalsIndex + 1).trim();

  if (!name) {
    return null;
  }

  const quote = value[0];
  if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
    value = value.slice(1, -1);
  }

  return [name, value];
}

async function loadDotEnv(dotEnvPath) {
  try {
    const content = await readFile(dotEnvPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const entry = parseEnvLine(line);
      if (!entry) {
        continue;
      }

      const [name, value] = entry;
      if (process.env[name] === undefined) {
        process.env[name] = value;
      }
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function inferContentType(file) {
  return MIME_BY_EXT.get(extname(file).toLowerCase()) ?? "application/octet-stream";
}

function joinPublicUrl(baseUrl, key) {
  return `${baseUrl.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}

function isNotFoundError(error) {
  const statusCode = error?.$metadata?.httpStatusCode;
  return statusCode === 404 || error?.name === "NotFound" || error?.name === "NoSuchKey";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await loadDotEnv(resolve(SKILL_DIR, ".env"));

  const file = args.file;
  if (!file) {
    throw new Error("Missing required argument: --file");
  }

  const key = args.key ?? basename(file);
  if (!key || key.includes("\\") || key.startsWith("/")) {
    throw new Error("Invalid --key. Use a relative R2 object key with forward slashes.");
  }

  await access(file);
  const fileStat = await stat(file);
  if (!fileStat.isFile()) {
    throw new Error(`Not a file: ${file}`);
  }

  const bucket = args.bucket ?? requireEnv("R2_BUCKET");
  const publicBaseUrl = args.publicBaseUrl ?? requireEnv("R2_PUBLIC_BASE_URL");
  const contentType = args.contentType ?? inferContentType(file);
  const cacheControl =
    args.cacheControl ?? process.env.R2_CACHE_CONTROL ?? "public, max-age=31536000, immutable";
  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  const url = joinPublicUrl(publicBaseUrl, key);

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          bucket,
          key,
          url,
          file,
          size: fileStat.size,
          endpoint,
          contentType,
          cacheControl,
          allowOverwrite: Boolean(args.allowOverwrite),
        },
        null,
        2,
      ),
    );
    return;
  }

  const { HeadObjectCommand, PutObjectCommand, S3Client } = await import(
    "@aws-sdk/client-s3"
  );

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  if (!args.allowOverwrite) {
    try {
      await client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
      throw new Error(
        `Object already exists: ${bucket}/${key}. Pass --allow-overwrite to replace it.`,
      );
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }
  }

  const response = await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: createReadStream(file),
      ContentType: contentType,
      CacheControl: cacheControl,
    }),
  );

  console.log(
    JSON.stringify(
      {
        bucket,
        key,
        url,
        file,
        size: fileStat.size,
        contentType,
        cacheControl,
        etag: response.ETag,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
