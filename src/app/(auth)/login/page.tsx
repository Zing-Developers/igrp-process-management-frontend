import { LoginForm } from "@/components/auth/login-form";
import { carouselItems, loginConfig } from "@/config/login";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

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
  const { callbackUrl } = await searchParams;

  return (
    <section className="flex min-h-screen flex-col md:flex-row">
      <div
        className={cn(
          "relative hidden w-full md:block md:w-1/2",
          "lg:order-first hidden lg:block",
          sliderPosition === "right" && "lg:order-last",
        )}
      >
        <div className="h-full overflow-hidden bg-muted">
          {/* biome-ignore lint/performance/noImgElement: the configured remote banner is not a Next-managed image asset. */}
          <img
            alt={carouselItems[0].title}
            className="h-full w-full object-cover"
            src={carouselItems[0].image.trim()}
          />
        </div>
      </div>
      <LoginForm
        callbackUrl={callbackUrl as string | undefined}
        description={texts.description}
        loginButton={texts.loginButton}
        logo={logo}
        name={name}
        welcome={texts.welcome}
      />
    </section>
  );
}
