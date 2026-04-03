import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Typography,
  Divider,
  message,
} from "antd";
import BASE_URL from "../api";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text, Link } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/login`,
        values
      );

      const user = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);

      message.success("Login Successful");

      if (user.role === "BUSINESS") {
        navigate("/landing");
      } else if (user.role === "CUSTOMER") {
        navigate("/complaints");
      }

    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Login failed");
      } else {
        message.error("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT SECTION */}
      <div style={styles.brandSection}>
        <Title style={styles.brandTitle}>
          Business Catalyzer
        </Title>
        <Text style={styles.brandSubtitle}>
          The Best Catalyst to your Business
        </Text>
      </div>

      <div style={styles.loginSection}>
        <Card style={styles.card} bordered={false}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Welcome Back
          </Title>

          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", marginBottom: 24 }}
          >
            Please login to your account
          </Text>

          <Form
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Username or Email"
              name="loginId"
              rules={[{ required: true, message: "Enter username or email!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter Username or Email" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div style={styles.flexBetween}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link>Forgot password?</Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>

            <Divider>Or</Divider>

            <div style={{ textAlign: "center" }}>
              <Text>
                Don’t have an account?{" "}
                <Link onClick={() => navigate("/signup")}>
                  Register
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>

      <div style={styles.emptySection}></div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "3fr 1fr 0.1fr",
    alignItems: "center",
    padding: "0 100px",
    columnGap: "100px",
  },
  brandSection: {
    paddingRight: "40px",
  },
  brandTitle: {
    color: "white",
    fontSize: 100,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 10,
  },
  brandSubtitle: {
    color: "white",
    fontSize: 30,
  },
  loginSection: {
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: 420,
    borderRadius: 20,
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,0.95)",
  },
  emptySection: {},
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default Login;
