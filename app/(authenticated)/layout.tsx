import { auth, currentUser } from "@/app/auth/server";
import type { ReactNode } from "react";
import { Header } from "./components/header";
import { AnimationProvider } from "./components/animation-provider";
import { QueryProvider } from "./providers/query-provider";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <QueryProvider>
      <AnimationProvider>
        <Header />
        {children}
      </AnimationProvider>
    </QueryProvider>
  )

};

export default AppLayout;
