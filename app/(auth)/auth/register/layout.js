import Footer, { BottomFooter } from "@/app/_components/Footer";
import MainNavbar from "@/app/_components/MainNavbar";

export const metadata = {
  title: "Register Page | King Mansa",
};

export default function AuthLayout({ children }) {
  return (
    <main>
      <MainNavbar />
      {children}
      <Footer />
      <BottomFooter />
    </main>
  );
}
