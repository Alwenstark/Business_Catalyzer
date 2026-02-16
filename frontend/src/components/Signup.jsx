import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; 

const { Title, Text, Link } = Typography;

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
          Create Account
        </Title>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          Join us by creating a new account
        </Text>

        <Form layout="vertical" name="signup_form">

          <Form.Item label="Full Name" name="name">
            <Input prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input prefix={<MailOutlined />} size="large" />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone">
            <Input prefix={<PhoneOutlined />} size="large" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block size="large">
              Sign Up
            </Button>
          </Form.Item>

          <Divider>Or</Divider>

          <div style={{ textAlign: "center" }}>
            <Text>
              Already have an ac?{" "}
              <Link onClick={() => navigate("/")}>
                Login
              </Link>
            </Text>
          </div>

        </Form>
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
    background: "transparent", 
  },
  card: {
    width: 400,
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,0.95)",
  },
};



export default Signup;
