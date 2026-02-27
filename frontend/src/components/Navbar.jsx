import React from "react";
import { Layout, Menu, Dropdown, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();

  const accountMenu = [
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/");
      },
    },
  ];

  return (
    <Header
      style={{
        background: "#000",   // PURE BLACK
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        height: "64px",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600 }}>
        Business Catalyzer
      </div>

      {/* CENTER MENU */}
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["home"]}
        style={{
          background: "transparent",
          flex: 1,
          justifyContent: "center",
          borderBottom: "none",
        }}
        items={[
          { key: "home", label: "Home" },
          { key: "messages", label: "Messages (3)" },
        ]}
      />

      {/* RIGHT SIDE */}
      <Dropdown menu={{ items: accountMenu }}>
        <Text style={{ color: "#fff", cursor: "pointer" }}>
          My Account <DownOutlined />
        </Text>
      </Dropdown>
    </Header>
  );
};

export default Navbar;