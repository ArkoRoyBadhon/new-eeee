
import MainNavbar from "../_components/MainNavbar";
import Footer, { BottomFooter } from "../_components/Footer";

export const metadata = {
  title: "Home Page | King Mansa",
};

export default function RootLayout({ children }) {
  return (
    <main>
      <MainNavbar />
      {children}
      <Footer />
      <BottomFooter />
    </main>
  );
}
