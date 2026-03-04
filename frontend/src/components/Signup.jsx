import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Radio,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text, Link } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("customer");

  const onFinish = async (values) => {
    setLoading(true);

    try {

      const payload = {
        ...values,
        role: accountType === "company" ? "BUSINESS" : "CUSTOMER"
      };

      await axios.post("http://localhost:8080/api/users/register", payload);

      message.success("Registered Successfully!");
      navigate("/");

    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Registration failed");
      } else {
        message.error("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

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

        <Form layout="vertical" onFinish={onFinish}>

          {/* ACCOUNT TYPE */}
          <Form.Item label="Account Type" name="type" initialValue="customer">
            <Radio.Group
              onChange={(e) => setAccountType(e.target.value)}
              value={accountType}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Radio.Button value="customer">Customer</Radio.Button>
              <Radio.Button value="company">Company</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Enter your name" }]}
              >
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Enter username" },
                  { min: 4, message: "Username must be at least 4 characters" }
                ]}
              >
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
              >
                <Input prefix={<PhoneOutlined />} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Enter email" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input prefix={<MailOutlined />} size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* COMPANY SECTION */}
          {accountType === "company" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Company Name"
                    name="companyName"
                    rules={[{ required: true, message: "Enter company name" }]}
                  >
                    <Input prefix={<BankOutlined />} size="large" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="GST / Registration ID"
                    name="gst"
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Company Address"
                    name="companyAddress"
                    rules={[{ required: true, message: "Enter company address" }]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Enter password" }]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>

          <Divider>Or</Divider>

          <div style={{ textAlign: "center" }}>
            <Text>
              Already have an account?{" "}
              <Link onClick={() => navigate("/")}>Login</Link>
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
  },
  card: {
    width: 500,
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,0.95)",
  },
};

export default Signup;