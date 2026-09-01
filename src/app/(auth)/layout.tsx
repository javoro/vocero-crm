import { DEFAULT_BRANDING } from "@/lib/branding";
import { getBranding } from "@/server/branding";

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const branding = await getBranding().catch(() => DEFAULT_BRANDING);
  return (
    <main className="flex min-h-screen items-center justify-center bg-subtle p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/logo-v2.png"
            alt={branding.name}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {branding.name === "Agentia CRM" ? (
                <>
                  agentia<span className="text-brand">CRM</span>
                </>
              ) : (
                branding.name
              )}
            </h1>
            <p className="mt-0.5 text-sm text-text-3">
              Agentes de IA y CRM para WhatsApp
            </p>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
