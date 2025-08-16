import type { PropsWithChildren } from "react";
import { Header } from "./Header";

import BottomNavAdapter from "@/components/BottomNavAdapter";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh bg-[#0B0B0B] text-[#F8F8F8]">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-28 md:pb-6">{children}</main>
    <BottomNavAdapter />
    </div>
  );
}
