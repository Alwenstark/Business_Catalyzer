import React, { useEffect } from "react";
import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {

    localStorage.removeItem("user");

    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);

    return () => clearTimeout(timer);

  }, [navigate]);

  return (
    <div style={styles.container}>

      <Card style={styles.card} bordered={false}>

        <Title level={2} style={{ textAlign: "center" }}>
          Logged Out
        </Title>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginTop: 10 }}
        >
          You have successfully logged out.
        </Text>

        <Text
          style={{ display: "block", textAlign: "center", marginTop: 20 }}
        >
          Redirecting to login page...
        </Text>

      </Card>

    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: 400,
    borderRadius: 20,
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
};

export default Logout;