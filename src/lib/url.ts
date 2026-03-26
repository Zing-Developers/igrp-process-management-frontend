export const normalizeURL = (url: string) => url.replace(/\/\//g, "/");

/**
 * Ideal for building public routes
 * @param assetName
 * @returns
 */
export const buildPublicUrlResource = (assetName: string) =>
  normalizeURL(`/${process.env.IGRP_APP_BASE_PATH ?? ""}/${assetName}`);
