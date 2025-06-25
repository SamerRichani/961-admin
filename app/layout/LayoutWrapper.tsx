import { Sidebar } from "@/components/sidebar/components/Sidebar";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full w-full overflow-auto">{children}</div>
      </main>
    </div>
  );
}
