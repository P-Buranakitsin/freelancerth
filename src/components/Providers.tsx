"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>;
};

export default Providers