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
  AutoComplete
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "../App.css";

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const CustomerComplaint = () => {

  const [mood, setMood] = useState(null);
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const moods = [
    { key: "APPRECIATION", emoji: "🙏", label: "Appreciation" },
    { key: "THANK_YOU", emoji: "😊", label: "Thank You" },
    { key: "HAPPY", emoji: "😁", label: "Happy" },
    { key: "NEUTRAL", emoji: "😐", label: "Neutral" },
    { key: "ANGRY", emoji: "😠", label: "Angry" },
    { key: "FRUSTRATED", emoji: "😡", label: "Frustrated" },
  ];

  const searchCompany = async (value) => {

    if (!value) {
      setOptions([]);
      return;
    }

    try {

      const res = await axios.get(
        `http://localhost:8080/api/business/search?name=${value}`
      );

      const autoOptions = res.data.map((c) => ({
        value: c.companyName,
        company: c
      }));

      setOptions(autoOptions);

    } catch (error) {
      console.error(error);
    }

  };

  const onSelectCompany = (value, option) => {

    const company = option.company;

    setSelectedCompany(company);

    form.setFieldsValue({
      company: company.companyName,
      gst: company.gst,
      state: company.state,
      district: company.district,
      pincode: company.pincode,
      companyType: company.companyType
    });

  };

  const onFinish = async (values) => {

    const userId = localStorage.getItem("userId");

    const payload = {

      user: {
        id: userId
      },

      companyName: values.company,
      gst: values.gst,
      state: values.state,
      district: values.district,
      pincode: values.pincode,
      companyType: values.companyType,
      complaint: values.complaint,
      notes: values.notes || "",
      mood: mood,
      imageBase64: imageBase64

    };

    try {

      await axios.post(
        "http://localhost:8080/api/cases",
        payload
      );

      message.success("Complaint Submitted Successfully!");

      form.resetFields();
      setMood(null);
      setSelectedCompany(null);
      setImageBase64(null);

    } catch (error) {

      message.error("Failed to submit complaint");

    }

  };

  const companyImage =
    selectedCompany?.profileImage && selectedCompany.profileImage !== ""
      ? selectedCompany.profileImage
      : `https://ui-avatars.com/api/?name=${selectedCompany?.companyName || "Company"}&background=0D8ABC&color=fff`;

  return (

    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1677ff 0%, #ffffff 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >

      <Content style={{ padding: "30px 60px" }}>

        <Form layout="vertical" form={form} onFinish={onFinish}>

          <Row gutter={[24, 24]} justify="space-between">

            {/* LEFT SIDE */}
            <Col span={14}>

              <Card style={styles.card}>

                <Row gutter={[16, 16]}>

                  <Col span={24}>
                    <Form.Item label="Company Name" name="company">

                      <AutoComplete
                        options={options}
                        onSearch={searchCompany}
                        onSelect={onSelectCompany}
                        placeholder="Search company..."
                        filterOption={false}
                      />

                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="GST Number" name="gst">
                      <Input placeholder="Enter GST No" />
                    </Form.Item>
                  </Col>

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

                  <Col span={12}>
                    <Form.Item label="Company Type" name="companyType">

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

              {/* COMPLAINT */}
              <Card style={styles.card}>

                <Form.Item
                  label="Describe Your Issue"
                  name="complaint"
                  rules={[{ required: true }]}
                >

                  <TextArea rows={4} placeholder="Explain your problem clearly..." />

                </Form.Item>

                <Row gutter={16}>

                  <Col span={12}>
                    <Form.Item label="Upload Evidence">

                      <Upload
                        beforeUpload={(file) => {

                          const reader = new FileReader();

                          reader.readAsDataURL(file);

                          reader.onload = () => {
                            setImageBase64(reader.result);
                          };

                          return false;
                        }}
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>Upload</Button>
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
            <Col span={9}>

              <Card style={styles.card}>

                <div style={styles.companyCard}>

                  <img
                    src={companyImage}
                    alt="company"
                    style={styles.companyImage}
                  />

                  <div>
                    <h3>{selectedCompany?.companyName || "Search a Company"}</h3>

                    <p>
                      📍 {selectedCompany?.companyAddress || "Company address will appear here"}
                    </p>

                    <p>
                      GST: {selectedCompany?.gst || "—"}
                    </p>
                  </div>

                </div>

              </Card>

              {/* MOODS */}
              <Card style={styles.card}>

                <div className="emoji-container">

                  {moods.map((item) => (

                    <div
                      key={item.key}
                      onClick={() => setMood(item.key)}
                      className={`emoji-box ${mood === item.key ? "selected" : ""}`}
                    >

                      <span className="emoji">{item.emoji}</span>

                      <span className="emoji-label">{item.label}</span>

                    </div>

                  ))}

                </div>

              </Card>

              {/* PREVIEW */}
              <Card style={styles.card}>

                <p>
                  <strong>Company:</strong>{" "}
                  {form.getFieldValue("company") || "—"}
                </p>

                <p><strong>Complaint:</strong></p>

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

              </Card>

              <Button type="primary" htmlType="submit" size="large" block>
                Submit Complaint
              </Button>

            </Col>

          </Row>

        </Form>

      </Content>

    </Layout >

  );

};

const styles = {

  card: {
    borderRadius: 14,
    marginBottom: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  previewBox: {
    background: "#f6f8fa",
    padding: 12,
    borderRadius: 10,
    minHeight: 80,
  },

  companyCard: {
    display: "flex",
    alignItems: "center",
    gap: 16
  },

  companyImage: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    objectFit: "cover"
  }

};

export default CustomerComplaint;