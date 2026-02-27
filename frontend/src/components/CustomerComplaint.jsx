import React, { useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../App.css";

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const CustomerComplaint = () => {
  const [mood, setMood] = useState(null);
  const [form] = Form.useForm();

  const moods = [
    { key: "love", emoji: "🥰" },
    { key: "happy", emoji: "😁" },
    { key: "good", emoji: "😊" },
    { key: "neutral", emoji: "😐" },
    { key: "angry", emoji: "😠" },
    { key: "very_angry", emoji: "😡" },
  ];

  const onFinish = (values) => {
    console.log({ ...values, mood });
    message.success("Complaint Submitted Successfully!");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "20px 40px" }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          style={{ height: "100%" }}
        >
          <Row gutter={24} style={{ height: "100%" }}>
            
            {/* LEFT SIDE */}
            <Col span={14}>
              <Card style={styles.card}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Company Name" name="company">
                      <Input.Search
                        placeholder="Search company..."
                        enterButton
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="GST Number">
                      <Input placeholder="Enter GST No" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="State">
                      <Input placeholder="State" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="District">
                      <Input placeholder="District" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Pincode">
                      <Input placeholder="Pincode" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Company Type">
                      <Select placeholder="Select Category">
                        <Option value="school">School</Option>
                        <Option value="college">College</Option>
                        <Option value="company">Company</Option>
                        <Option value="cafe">Cafe</Option>
                        <Option value="hotel">Hotel</Option>
                        <Option value="restaurant">Restaurant</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card style={styles.card}>
                <Form.Item
                  label="Describe Your Issue"
                  name="complaint"
                  rules={[
                    { required: true, message: "Please describe your issue" },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Explain your problem clearly..."
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Upload Evidence">
                      <Upload>
                        <Button icon={<UploadOutlined />}>
                          Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Additional Notes" name="notes">
                      <TextArea rows={2} placeholder="Optional..." />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* RIGHT SIDE */}
            <Col span={10}>
              <Card style={styles.card}>
                <div className="emoji-container">
                  {moods.map((item) => (
                    <span
                      key={item.key}
                      onClick={() => setMood(item.key)}
                      className={`emoji ${
                        mood === item.key ? "selected" : ""
                      }`}
                    >
                      {item.emoji}
                    </span>
                  ))}
                </div>
              </Card>

              <Card style={styles.card}>
                <div style={{ lineHeight: "1.8" }}>
                  <p>
                    <strong>Company:</strong>{" "}
                    {form.getFieldValue("company") || "—"}
                  </p>

                  <p>
                    <strong>Complaint:</strong>
                  </p>

                  <div style={styles.previewBox}>
                    {form.getFieldValue("complaint") ||
                      "Your complaint preview will appear here..."}
                  </div>

                  <p style={{ marginTop: 10 }}>
                    <strong>Mood:</strong>{" "}
                    <span style={{ fontSize: 28 }}>
                      {moods.find((m) => m.key === mood)?.emoji || "—"}
                    </span>
                  </p>

                  <p>
                    <strong>Notes:</strong>{" "}
                    {form.getFieldValue("notes") || "—"}
                  </p>
                </div>
              </Card>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{ marginTop: 15 }}
              >
                Submit Complaint
              </Button>
            </Col>
          </Row>
        </Form>
      </Content>
    </Layout>
  );
};

const styles = {
  card: {
    marginBottom: 20,
    borderRadius: 12,
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  previewBox: {
    background: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    minHeight: 60,
  },
};

export default CustomerComplaint;