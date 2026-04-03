import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Button, Spin } from "antd";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import BASE_URL from "../api";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const { Content } = Layout;

const Landingpage = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = (days = 365) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.companyName) {
      console.error("Company name not found");
      setLoading(false);
      return;
    }

    const companyName = user.companyName;

    setLoading(true);

    axios.get(`${BASE_URL}/api/cases/dashboard`, {
      params: {
        companyName,
        days
      }
    })
      .then(res => {
        setDashboard(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);


  const lineData = dashboard ? {
    labels: Object.keys(dashboard.incomingGraph || {}),
    datasets: [
      {
        label: "Positive Cases",
        data: Object.values(dashboard.incomingGraph || {}).map(v => v.positive),
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        label: "Negative Cases",
        data: Object.values(dashboard.incomingGraph || {}).map(v => v.negative),
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "Neutral Cases",
        data: Object.values(dashboard.incomingGraph || {}).map(v => v.neutral),
        borderColor: "gray",
        backgroundColor: "gray",
      },
    ],
  } : {};


  const barData = dashboard ? {
    labels: Object.keys(dashboard.weeklyTrend || {}),
    datasets: [
      {
        label: "Incoming",
        data: Object.values(dashboard.weeklyTrend || {}).map(v => v.incoming),
        backgroundColor: "green",
      },
      {
        label: "Resolved",
        data: Object.values(dashboard.weeklyTrend || {}).map(v => v.resolved),
        backgroundColor: "yellow",
      },
      {
        label: "Reopened",
        data: Object.values(dashboard.weeklyTrend || {}).map(v => v.reopened),
        backgroundColor: "red",
      },
    ],
  } : {};

  const pieData = dashboard ? {
    labels: [
      "Negative → Positive",
      "Negative → Negative",
      "Positive → Positive",
      "Positive → Negative",
      "Others"
    ],
    datasets: [
      {
        data: [
          dashboard.resolutionGraph?.negative_to_positive || 0,
          dashboard.resolutionGraph?.negative_to_negative || 0,
          dashboard.resolutionGraph?.positive_to_positive || 0,
          dashboard.resolutionGraph?.positive_to_negative || 0,
          dashboard.resolutionGraph?.others || 0
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FF9800", "#9E9E9E"],
        borderWidth: 1
      },
    ],
  } : {};

  return (
    <Layout
      style={{
        height: "80vh",
        background: "linear-gradient(135deg, #1677ff 0%, #ffffff 100%)",
      }}
    >
      <Content
        style={{
          padding: "30px",
          height: "calc(100vh - 64px)",
          overflowY: "auto"
        }}
      >

        <Row justify="center" style={{ marginBottom: 20 }}>
          <Button type="primary" style={{ margin: 5 }} onClick={() => fetchDashboard("7")}>
            Last 7 Days
          </Button>
          <Button type="primary" style={{ margin: 5 }} onClick={() => fetchDashboard("30")}>
            Last 30 Days
          </Button>
          <Button type="primary" style={{ margin: 5 }} onClick={() => fetchDashboard("180")}>
            Last 6 Month
          </Button>
          <Button type="primary" style={{ margin: 5 }} onClick={() => fetchDashboard("365")}>
            Last 1 Year
          </Button>
        </Row>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 100 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={20}>

              <Col span={14}>
                <Card title="Incoming Ticket - Classification based on mood">
                  {dashboard && <Line data={lineData} />}
                </Card>
              </Col>

              <Col span={10}>
                <Card
                  style={{
                    marginBottom: 10,
                    borderRadius: "12px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    padding: "1px"
                  }}
                >
                  <Row gutter={[16, 16]}>

                    <Col span={24}>
                      <div
                        style={{
                          background: "#000000",
                          color: "#ffffff",
                          borderRadius: "10px",
                          padding: "12px",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "14px", opacity: 0.8 }}>Total Cases</div>
                        <div style={{ fontSize: "26px", fontWeight: "bold" }}>
                          {dashboard?.summary?.totalCases || 0}
                        </div>
                      </div>
                    </Col>

                    <Col span={12}>
                      <div
                        style={{
                          background: "#000000",
                          color: "#ffffff",
                          borderRadius: "10px",
                          padding: "12px",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "13px" }}>Active</div>
                        <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                          {dashboard?.summary?.activeCases || 0}
                        </div>
                      </div>
                    </Col>

                    <Col span={12}>
                      <div
                        style={{
                          background: "#000000",
                          color: "#ffffff",
                          borderRadius: "10px",
                          padding: "12px",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "13px" }}>Closed</div>
                        <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                          {dashboard?.summary?.closedCases || 0}
                        </div>
                      </div>
                    </Col>

                  </Row>
                </Card>

                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>

                  <Card
                    style={{
                      background: "#000000",
                      color: "#fff",
                      transition: "0.3s",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                    hoverable
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <div style={{ fontSize: "16px" }}>
                      Positive Cases
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", }}>
                      {dashboard?.summary?.positiveCases || 0}
                    </div>
                  </Card>

                  <Card
                    style={{
                      background: "#000000",
                      color: "#fff",
                      transition: "0.3s",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                    hoverable
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <div style={{ fontSize: "16px" }}>
                      Negative Cases
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                      {dashboard?.summary?.negativeCases || 0}
                    </div>
                  </Card>

                  <Card
                    style={{
                      background: "#000000",
                      color: "#fff",
                      transition: "0.3s",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                    hoverable
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <div style={{ fontSize: "16px" }}>
                      Neutral Cases
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                      {dashboard?.summary?.neutralCases || 0}
                    </div>
                  </Card>

                </div>
              </Col>
            </Row>

            <Row gutter={20} style={{ marginTop: 30 }}>

              <Col span={14}>
                <Card title="Case Resolution Speed">
                  <div style={{ height: "300px" }}>
                    {dashboard && (
                      <Bar
                        data={barData}
                        options={{ maintainAspectRatio: false }}
                      />
                    )}
                  </div>
                </Card>
              </Col>

              <Col span={10}>
                <Card title="Incoming to Resolution Trend">
                  <div style={{ height: "300px" }}>
                    {dashboard && (
                      <Pie
                        data={pieData}
                        options={{
                          maintainAspectRatio: false
                        }}
                      />
                    )}
                  </div>
                </Card>
              </Col>


            </Row>
          </>
        )}

      </Content>
    </Layout>
  );
};

export default Landingpage;