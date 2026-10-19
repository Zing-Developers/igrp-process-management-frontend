"use client";

import { IRNAuthForm } from "@irn/irn-backoffice-design-system";
import { signInIRN } from "@irn/irn-core-framework/client";

type LoginFormProps = {
  backgroundImage: { src: string; alt: string };
  callbackUrl?: string;
  description: string;
  loginButton: string;
  logo: { src: string };
  name: string;
  sliderPosition: "left" | "right";
  welcome: string;
};

export function LoginForm({
  backgroundImage,
  callbackUrl,
  description,
  loginButton,
  logo,
  name,
  sliderPosition,
  welcome,
}: LoginFormProps) {
  return (
    <IRNAuthForm
      backgroundImage={backgroundImage}
      btnText={loginButton}
      description={description}
      logo={{ src: logo.src, alt: name }}
      onAuthenticate={async () => {
        await signInIRN("keycloak", { callbackUrl });
      }}
      title={welcome}
    />
  );
}
