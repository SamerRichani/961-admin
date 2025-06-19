
import { Sidebar } from "@/components/sidebar/components/Sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full w-full overflow-auto">{children}</div>
      </main>
    </div>
  );
}
