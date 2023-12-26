"use client";
import { LineChartOutlined } from "@ant-design/icons";
import { Menu, MenuProps, notification } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const paths = {
  course: "/course",
  courseResult: "/course/result",
};

const items: MenuItem[] = [
  getItem("Course Manage", "course-manage", <LineChartOutlined />, [
    getItem("Course", "course", <Link href={paths.course} />),
  ]),
];

export default function Sidebar() {
  return (
    <aside className="h-screen">
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
      />
    </aside>
  );
}
