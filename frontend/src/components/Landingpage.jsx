import React from "react";
import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Landingpage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // If later you store token in localStorage, clear it here
    // localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <Title level={2}>Welcome 🎉</Title>

      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
};

export default Landingpage;
