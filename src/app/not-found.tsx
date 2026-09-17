import { IGRPButtonPrimitive } from "@igrp/igrp-framework-react-design-system";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Página não encontrada",
  description: "A página que você está procurando não foi encontrada.",
};

export default function NotFound() {
  const appCode = process.env.IGRP_APP_CODE || "";

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Página não encontrada
        </h2>
        <p className="mb-8 text-base text-muted-foreground sm:text-lg">
          Desculpe, página não foi encontrada.
        </p>
        <div className="flex justify-center">
          <IGRPButtonPrimitive asChild size="lg" className="min-w-40">
            <Link href="/">Voltar à Página Inicial</Link>
          </IGRPButtonPrimitive>
        </div>
        {appCode && <span className="sr-only">{appCode}</span>}
      </div>
    </div>
  );
}
