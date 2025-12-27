import Footer from "./components/footer";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col h-screen relative">{children}</div>;
}
