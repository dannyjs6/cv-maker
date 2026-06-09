"use client";

import { MantineProvider } from "@mantine/core";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);
