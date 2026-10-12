import { LoginForm } from "@/components/auth/login-form";
import { carouselItems, loginConfig } from "@/config/login";
import { siteConfig } from "@/config/site";

const { sliderPosition, texts } = loginConfig;
const { logo, name } = siteConfig;

export const metadata = {
  title: "Login",
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = (resolvedSearchParams?.callbackUrl ??
    resolvedSearchParams?.returnUrl) as string | undefined;

  return (
    <LoginForm
      backgroundImage={{
        src: carouselItems[0].image.trim(),
        alt: carouselItems[0].title,
      }}
      callbackUrl={callbackUrl}
      description={texts.description}
      loginButton={texts.loginButton}
      logo={logo}
      name={name}
      sliderPosition={sliderPosition}
      welcome={texts.welcome}
    />
  );
}
