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
  Upload,
  Select
} from "antd";

import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PlusOutlined
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text, Link } = Typography;


const Signup = () => {

  const { Option } = Select;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("customer");
  const [profileImage, setProfileImage] = useState(null);

  // Convert Image → Base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Upload handler
  const handleUpload = async ({ file }) => {
    const base64 = await getBase64(file);
    setProfileImage(base64);
  };

  // Submit form
  const onFinish = async (values) => {

    setLoading(true);

    try {

      const payload = {
        ...values,
        role: accountType === "company" ? "BUSINESS" : "CUSTOMER",
        profileImage: profileImage
      };

      await axios.post(
        "http://localhost:8080/api/users/register",
        payload
      );

      message.success("Registered Successfully!");
      navigate("/");

    } catch (error) {

      if (error.response) {
        message.error(
          error.response.data.message || "Registration failed"
        );
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

        <Title level={3} style={{ textAlign: "center" }}>
          Create Account
        </Title>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 20
          }}
        >
          Join us by creating a new account
        </Text>

        <Form layout="vertical" onFinish={onFinish}>

          {/* ACCOUNT TYPE */}

          <Form.Item
            label="Account Type"
            name="type"
            initialValue="customer"
          >
            <Radio.Group
              onChange={(e) => setAccountType(e.target.value)}
              value={accountType}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Radio.Button value="customer">
                Customer
              </Radio.Button>

              <Radio.Button value="company">
                Company
              </Radio.Button>

            </Radio.Group>
          </Form.Item>


          {/* BASIC DETAILS */}

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
                  { min: 4, message: "Minimum 4 characters" }
                ]}
              >
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>
            </Col>

          </Row>


          {/* CONTACT */}

          <Row gutter={16}>

            <Col span={12}>
              <Form.Item label="Phone" name="phone">
                <Input prefix={<PhoneOutlined />} size="large" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Enter email" },
                  { type: "email", message: "Invalid email" }
                ]}
              >
                <Input prefix={<MailOutlined />} size="large" />
              </Form.Item>
            </Col>

          </Row>


          {accountType === "company" && (
            <>
              <Row gutter={16}>

                <Col span={6}>
                  <Form.Item label="Company Logo">
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      customRequest={handleUpload}
                    >
                      <Button icon={<PlusOutlined />} block>
                        Upload
                      </Button>
                    </Upload>

                    {profileImage && (
                      <img
                        src={profileImage}
                        alt="logo"
                        style={{
                          marginTop: 10,
                          width: "100%",
                          borderRadius: 8,
                          border: "1px solid #eee"
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col span={18}>
                  <Form.Item
                    label="Company Name"
                    name="companyName"
                    rules={[{ required: true, message: "Enter company name" }]}
                  >
                    <Input prefix={<BankOutlined />} size="large" />
                  </Form.Item>
                </Col>

              </Row>


              <Row gutter={16}>

                <Col span={12}>
                  <Form.Item label="GST / Registration ID" name="gst">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Company Type" name="companyType">
                    <Select placeholder="Select Category">
                      <Select.Option value="School">School</Select.Option>
                      <Select.Option value="College">College</Select.Option>
                      <Select.Option value="Company">Company</Select.Option>
                      <Select.Option value="Cafe">Cafe</Select.Option>
                      <Select.Option value="Hotel">Hotel</Select.Option>
                      <Select.Option value="Restaurant">Restaurant</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

              </Row>


              <Row gutter={16}>

                <Col span={8}>
                  <Form.Item label="State" name="state">
                    <Input placeholder="State" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="District" name="district">
                    <Input placeholder="District" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Pincode" name="pincode">
                    <Input placeholder="Pincode" />
                  </Form.Item>
                </Col>

              </Row>


              <Form.Item
                label="Company Address"
                name="companyAddress"
                rules={[{ required: true, message: "Enter address" }]}
              >
                <Input prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </>
          )}


          {/* PASSWORD */}

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>


          {/* BUTTON */}

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
    overflow: "auto"
  },

  card: {
    width: 700,
    borderRadius: 14,
    boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,0.95)"
  }

};

export default Signup;