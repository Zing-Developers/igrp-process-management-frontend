"use client";

import {
  getSession,
  type SignInOptions,
  type SignOutParams,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";

export const getIRNSession = getSession;
export const signInIRN = (provider?: string, options?: SignInOptions) =>
  signIn(provider, options);
export const signOutIRN = <Redirect extends boolean = true>(
  options?: SignOutParams<Redirect>,
) => signOut<Redirect>(options);
export const useIRNSession = useSession;
