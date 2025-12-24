import Footer from "./components/footer";

export default function loginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      {children}
      
    </div>
  );
}
