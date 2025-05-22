import MainNavbar from "@/app/_components/MainNavbar";
import Footer, { BottomFooter } from "@/app/_components/Footer";

export const metadata = {
  title: "Login Page | King Mansa",
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
