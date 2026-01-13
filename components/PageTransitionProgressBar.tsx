"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { type ReactNode, Suspense } from "react";

export const PageTransitionProgressBar = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <Suspense>
      <PageTransitionProgressBarContent>
        {children}
      </PageTransitionProgressBarContent>
    </Suspense>
  );
};

export const PageTransitionProgressBarContent = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <ProgressProvider
      height="2px"
      color="#FF7348"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
