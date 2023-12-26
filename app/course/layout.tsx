import { AppContextProvider } from "@/context/AppContext";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
