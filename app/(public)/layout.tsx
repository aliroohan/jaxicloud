import { SiteFooter, SiteHeader } from "@/components/public/SiteChrome";
import { SplashScreen } from "@/components/layout/SplashScreen/SplashScreen";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SplashScreen />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

