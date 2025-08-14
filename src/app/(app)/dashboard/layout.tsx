import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Dashboard",
  description: "Manage your HiddenEcho account, see feedback, and customize your settings.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
