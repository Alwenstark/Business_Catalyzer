import React from "react";
import { Layout, Row, Col, Card, Button } from "antd";
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

  // LINE CHART
  const lineData = {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Positive Cases",
        data: [3, 0, 1, 0, 1, 1, 1],
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        label: "Negative Cases",
        data: [2, 0, 2, 1, 2, 1, 0],
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "Neutral Cases",
        data: [1, 0, 1, 3, 1, 0, 0],
        borderColor: "gray",
        backgroundColor: "gray",
      },
    ],
  };

  // BAR CHART
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Incoming",
        data: [4, 5, 4, 1, 2],
        backgroundColor: "green",
      },
      {
        label: "Resolved",
        data: [3, 3, 3, 1, 1],
        backgroundColor: "yellow",
      },
    ],
  };

  // PIE CHART
  const pieData = {
    labels: ["Positive to Positive", "Others"],
    datasets: [
      {
        data: [33, 67],
        backgroundColor: ["#36A2EB", "#FF1493"],
      },
    ],
  };

  return (
    <Layout>

      <Content style={{ padding: "30px" }}>
        
        {/* FILTER BUTTONS */}
        <Row justify="center" style={{ marginBottom: 20 }}>
          <Button type="primary" style={{ margin: 5 }}>Last 7 Days</Button>
          <Button type="primary" style={{ margin: 5 }}>Last 30 Days</Button>
          <Button type="primary" style={{ margin: 5 }}>Last 6 Month</Button>
          <Button type="primary" style={{ margin: 5 }}>Last 1 Year</Button>
        </Row>

        <Row gutter={20}>
          {/* LINE CHART */}
          <Col span={14}>
            <Card title="Incoming Ticket - Classification based on mood">
              <Line data={lineData} />
            </Card>
          </Col>

          {/* STATS BOXES */}
          <Col span={10}>
            <Card style={{ marginBottom: 10 }}>
              <h3>Total cases</h3>
              <h2>21</h2>
              <h3>Active cases</h3>
              <h2>16</h2>
              <h3>Closed cases</h3>
              <h2>5</h2>
            </Card>

            <Card style={{ background: "#7bd77b", marginBottom: 10 }}>
              Positive cases 7
            </Card>

            <Card style={{ background: "#f7a896", marginBottom: 10 }}>
              Negative cases 8
            </Card>

            <Card style={{ background: "#f3f5a1" }}>
              Neutral cases 6
            </Card>
          </Col>
        </Row>

        {/* BOTTOM ROW */}
        <Row gutter={20} style={{ marginTop: 30 }}>
          <Col span={14}>
            <Card title="Case Resolution Speed">
              <Bar data={barData} />
            </Card>
          </Col>

          <Col span={10}>
            <Card title="Incoming to Resolution Trend">
              <Pie data={pieData} />
            </Card>
          </Col>
        </Row>

      </Content>
    </Layout>
  );
};

export default Landingpage;