import fs from "node:fs";

export const JWT_PRIVATE_KEY_ENV = "JWT_PRIVATE_KEY";
export const JWT_PRIVATE_KEY_FILE_ENV = "Authentication__JwtPrivateKey";
export const JWT_MIDDLEWARE_PRIVATE_KEY_ENV = "IRN_AUTH_MIDDLEWARE_PRIVATE_KEY";

const normalizePem = (value: string) => value.replace(/\\n/g, "\n").trim();

/**
 * Local and Kubernetes deployments provide direct PEM content through
 * JWT_PRIVATE_KEY. Production provides a PEM pathname through
 * Authentication__JwtPrivateKey. Direct PEM is intentionally preferred.
 */
export function resolveJwtPrivateKey(): string | false {
  const directPem = process.env[JWT_PRIVATE_KEY_ENV];
  if (directPem?.trim()) return normalizePem(directPem);

  const keyPath = process.env[JWT_PRIVATE_KEY_FILE_ENV];
  if (!keyPath?.trim()) return false;

  try {
    return normalizePem(fs.readFileSync(keyPath.trim(), "utf-8"));
  } catch {
    console.error(
      "Failed to resolve JWT private key from configured key source",
    );
    return false;
  }
}

/** Makes content available to the SDK without asking it to interpret a file path. */
export function prepareJwtPrivateKeyForMiddleware(): void {
  const privateKey = resolveJwtPrivateKey();
  if (privateKey) process.env[JWT_MIDDLEWARE_PRIVATE_KEY_ENV] = privateKey;
}

export function getJwtMiddlewarePrivateKeyEnvVar(): string {
  return process.env[JWT_MIDDLEWARE_PRIVATE_KEY_ENV]?.trim()
    ? JWT_MIDDLEWARE_PRIVATE_KEY_ENV
    : JWT_PRIVATE_KEY_ENV;
}
