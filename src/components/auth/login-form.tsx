"use client";

import { signInIRN } from "@irn/irn-core-framework/client";

type LoginFormProps = {
  callbackUrl?: string;
  description: string;
  loginButton: string;
  logo: { src: string; width: number; height: number };
  name: string;
  welcome: string;
};

export function LoginForm({
  callbackUrl,
  description,
  loginButton,
  logo,
  name,
  welcome,
}: LoginFormProps) {
  return (
    <div className="flex w-full items-center justify-center px-6 py-12 md:w-1/2">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
        <img alt={name} height={logo.height} src={logo.src} width={logo.width} />
        <div>
          <h1 className="text-2xl font-bold">{welcome}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <button
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
          onClick={() => signInIRN("keycloak", { callbackUrl })}
          type="button"
        >
          {loginButton}
        </button>
      </div>
    </div>
  );
}
