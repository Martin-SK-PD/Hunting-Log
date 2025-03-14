import { Outlet } from "react-router-dom";
import Navigation from "./navigation";
import Footer from "./footer";

function Layout() {
  return (
    <>
    <Navigation />
        <main>
        <Outlet />
        </main>
    <Footer />
    </>
  );
}

export default Layout;
