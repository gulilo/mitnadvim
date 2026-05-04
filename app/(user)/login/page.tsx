import Image from "next/image";
import Footer from "./components/footer";
import LoginForm from "./components/loginForm";

export default function Login() {
  
  return (
    <div className="fixed inset-0 flex flex-col items-center pt-8 pb-6 px-4 overflow-y-auto bg-[#FF0000]">
      <div className="relative w-72 h-48 mb-6 md:w-96 md:h-64">
        <Image
          src={"/MDA_Dan_logo.png"}
          fill
          alt="MDA Logo"
          className="object-contain"
        />
      </div>
      <LoginForm />
      <Footer />
    </div>
  );
}
