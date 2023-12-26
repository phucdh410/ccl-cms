import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import Sidebar from "@/components/Sidebar";
import { Content } from "antd/es/layout/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CCL Vietnamese Portal",
  description: "CCL Vietnamese Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout className="overflow-hidden">
          <Sider width="20%">
            <Sidebar />
          </Sider>
          <Layout>
            <Content>{children}</Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
