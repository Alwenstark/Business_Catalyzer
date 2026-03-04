import React from "react";
import { Layout, Menu, Dropdown, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (e) => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (e.key === "home") {

      if (!user) {
        navigate("/");
        return;
      }

      if (user.role === "BUSINESS") {
        navigate("/landing");
      }

      if (user.role === "CUSTOMER") {
        navigate("/complaints");
      }
    }

    if (e.key === "messages") {
      navigate("/casepage");
    }
  };

  const accountMenu = [
    {
      key: "logout",
      label: "Logout",
      onClick: () => navigate("/logout"),
    },
  ];

  const getSelectedKey = () => {

    if (
      location.pathname === "/landing" ||
      location.pathname === "/complaints"
    ) {
      return ["home"];
    }

    if (location.pathname === "/casepage") {
      return ["messages"];
    }

    return [];
  };

  return (
    <Header
      style={{
        background: "#000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
      }}
    >

      {/* LEFT LOGO */}
      <div
        style={{
          color: "#fff",
          fontSize: "18px",
          fontWeight: 600,
          cursor: "pointer",
        }}
        onClick={() => handleMenuClick({ key: "home" })}
      >
        Business Catalyzer
      </div>

      {/* CENTER MENU */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getSelectedKey()}
        onClick={handleMenuClick}
        style={{
          background: "transparent",
          flex: 1,
          justifyContent: "center",
          borderBottom: "none",
        }}
        items={[
          {
            key: "home",
            label: "Home",
          },
          {
            key: "messages",
            label: "Messages (3)",
          },
        ]}
      />

      {/* ACCOUNT MENU */}
      <Dropdown menu={{ items: accountMenu }}>
        <Text style={{ color: "#fff", cursor: "pointer" }}>
          My Account <DownOutlined />
        </Text>
      </Dropdown>

    </Header>
  );
};

export default Navbar;