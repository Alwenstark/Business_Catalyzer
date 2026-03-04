import React, { useState } from "react";
import { Layout, List, Avatar, Input, Button } from "antd";

const { Sider, Content } = Layout;

const CasePage = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const users = [
    { id: 1, name: "John", last: "Hello there!" },
    { id: 2, name: "Alice", last: "Complaint updated" },
    { id: 3, name: "David", last: "Need support" },
  ];

  const sendMessage = () => {
    if (!message) return;

    setMessages([
      ...messages,
      { text: message, sender: "me" }
    ]);

    setMessage("");
  };

  return (
    <Layout style={{ height: "100vh" }}>

      {/* LEFT CHAT LIST */}
      <Sider width={320} style={{ background: "#fff" }}>

        <div
          style={{
            padding: 16,
            fontWeight: 600,
            fontSize: 16,
            borderBottom: "1px solid #eee"
          }}
        >
          Messages
        </div>

        <List
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              onClick={() => setSelectedUser(user)}
              style={{
                cursor: "pointer",
                padding: "12px 20px"
              }}
            >
              <List.Item.Meta
                avatar={<Avatar>{user.name[0]}</Avatar>}
                title={user.name}
                description={user.last}
              />
            </List.Item>
          )}
        />

      </Sider>

      {/* CHAT WINDOW */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#f0f2f5"
        }}
      >

        {/* CHAT HEADER */}
        <div
          style={{
            padding: 16,
            background: "#fff",
            borderBottom: "1px solid #eee",
            fontWeight: 600
          }}
        >
          {selectedUser ? selectedUser.name : "Select a conversation"}
        </div>

        {/* MESSAGE AREA */}
        <div
          style={{
            flex: 1,
            padding: 20,
            overflowY: "auto"
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === "me" ? "right" : "left",
                marginBottom: 10
              }}
            >
              <span
                style={{
                  background: msg.sender === "me" ? "#dcf8c6" : "#fff",
                  padding: "8px 14px",
                  borderRadius: 8,
                  display: "inline-block"
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div
          style={{
            padding: 16,
            background: "#fff",
            display: "flex",
            gap: 10
          }}
        >
          <Input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={sendMessage}
          />

          <Button type="primary" onClick={sendMessage}>
            Send
          </Button>
        </div>

      </Content>

    </Layout>
  );
};

export default CasePage;