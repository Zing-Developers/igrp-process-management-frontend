import jwt, { type JwtPayload } from "jsonwebtoken";
import type { LRUCache } from "lru-cache";
import { resolveJwtPrivateKey } from "./jwt-private-key";

export async function getOrFetchToken(
  key: string,
  cache: LRUCache<string, string>,
): Promise<string> {
  let token = cache.get(key);

  if (!token) {
    token = await fetchNewToken();
    cache.set(key, token);
  }

  return token;
}

export function getAPISecretKey(): string | boolean {
  return resolveJwtPrivateKey();
}

export async function fetchNewToken(): Promise<string> {
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60; // 60 mins

  const key = process.env.JWT_KEY ?? "";

  return await generateRS256Token({
    key,
    exp: ttl,
  });
}

export async function generateRS256Token({
  ...payload
}: JwtPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    const privateKey = getAPISecretKey() as string;
    const options: jwt.SignOptions = {
      algorithm: "RS256",
    };

    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err || !token) {
        reject(err || new Error("Error generating token"));
        return;
      }
      resolve(token);
    });
  });
}

export async function verifyRS256Token(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    const publicKey = process.env.JWT_KEY ?? "";

    const options: jwt.VerifyOptions = {
      algorithms: ["RS256"],
    };

    jwt.verify(token, publicKey, options, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded as JwtPayload);
    });
  });
}
