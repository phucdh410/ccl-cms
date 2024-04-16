"use client";

import { getCookie } from "@/utils/cookie";
import { redirect, usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import Sidebar from "@/components/Sidebar";
import { Content } from "antd/es/layout/layout";

export const AuthCheckProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const userInfo = getCookie("auth");
  const pathname = usePathname();

  if (
    !userInfo &&
    !pathname.includes("login") &&
    !pathname.includes("confirm")
  ) {
    redirect("/login");
  }

  return (
    <>
      {pathname === "/login" || pathname === "/confirm" ? (
        children
      ) : (
        <Layout className="overflow-hidden">
          <Sider width="20%">
            <Sidebar />
          </Sider>
          <Layout>
            <Content>{children}</Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};
