"use client";

import { UserButton } from "@/app/auth/client";
import { ModeToggle } from "@/app/design-system/components/mode-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
} from "@/app/design-system/components/ui/sidebar";
import type { ReactNode } from "react";
import { Search } from "./search";

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader />
        <Search />
        <SidebarContent />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "flex overflow-hidden w-full",
                    userButtonBox: "flex-row-reverse",
                    userButtonOuterIdentifier: "truncate pl-0",
                  },
                }}
                showName
              />
              <div className="flex shrink-0 items-center gap-px">
                <ModeToggle />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
