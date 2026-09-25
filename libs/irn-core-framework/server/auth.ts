import NextAuth, { type AuthOptions, getServerSession } from "next-auth";

export type IRNAuthOptions = AuthOptions;

export const createIRNAuthHandler = (options: IRNAuthOptions) =>
  NextAuth(options);
export const getIRNServerSession = (options: IRNAuthOptions) =>
  getServerSession(options);
