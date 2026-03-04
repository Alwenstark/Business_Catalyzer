import React from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import bg from "../assets/emoji_wave.png";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isSignupPage = location.pathname === "/signup";
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/signup" || location.pathname === "/logout";

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: isSignupPage
          ? `
      url(${bg}),
      linear-gradient(135deg, #1677ff 0%, #ffffff 100%)
    `
          : "linear-gradient(135deg, #1677ff 0%, #ffffff 100%)",
        backgroundSize: isSignupPage ? "cover, cover" : "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

      }}
    >
      {!hideNavbar && <Navbar />}
      {children}
    </Layout>
  );
};

export default MainLayout;
