import React, { useState, useEffect } from "react";
import { Layout, List, Avatar, Input, Button, Image, Modal } from "antd";
import axios from "axios";
import chatBg from "../assets/chat.png";

const { Sider, Content } = Layout;

const CasePage = () => {

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const moods = [
    { key: "APPRECIATION", emoji: "🙏", label: "Appreciation" },
    { key: "THANK_YOU", emoji: "😊", label: "Thank You" },
    { key: "HAPPY", emoji: "😁", label: "Happy" },
    { key: "NEUTRAL", emoji: "😐", label: "Neutral" },
    { key: "ANGRY", emoji: "😠", label: "Angry" },
    { key: "FRUSTRATED", emoji: "😡", label: "Frustrated" }
  ];

  useEffect(() => {
    loadCases();
  }, []);

  const submitMood = async (moodKey) => {

    try {

      await axios.put(
        `http://localhost:8080/api/cases/${selectedCase.id}/status`,
        null,
        { params: { status: "RESOLVED" } }
      );

      await axios.put(
        `http://localhost:8080/api/cases/${selectedCase.id}/mood`,
        null,
        { params: { mood: moodKey } }
      );

      setIsMoodModalOpen(false);

      setSelectedCase(prev => ({
        ...prev,
        status: "RESOLVED",
        mood: moodKey
      }));

    } catch (err) {
      console.error(err);
    }

  };

  const loadCases = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      let res;

      if (role === "CUSTOMER") {

        res = await axios.get(
          `http://localhost:8080/api/cases/user/${userId}`
        );

      } else {

        res = await axios.get(
          "http://localhost:8080/api/cases/company",
          { params: { name: user.companyName } }
        );

      }

      const casesData = res.data;

      // fetch business profile images
      const updatedCases = await Promise.all(
        casesData.map(async (c) => {

          try {

            const business = await axios.get(
              `http://localhost:8080/api/business/search?name=${c.companyName}`
            );

            return {
              ...c,
              business: business.data[0]
            };

          } catch {
            return c;
          }

        })
      );

      setCases(updatedCases);

    } catch (err) {
      console.error(err);
    }

  };

  const updateStatus = async (status) => {

    try {

      const res = await axios.put(
        `http://localhost:8080/api/cases/${selectedCase.id}/status`,
        null,
        { params: { status } }
      );

      setSelectedCase(res.data);

    } catch (err) {
      console.error(err);
    }

  };

  const selectCase = async (caseItem) => {

    try {

      setSelectedCase(caseItem);

      // Get replies/messages from backend
      const res = await axios.get(
        `http://localhost:8080/api/messages/${caseItem.id}`
      );

      const apiMessages = res.data || [];

      // Build the initial complaint as the first message
      const complaintMessage = {
        id: `case-${caseItem.id}`,
        text: caseItem.complaint,
        imageBase64: caseItem.imageBase64,
        sender: caseItem.user,   // complaint sender = customer
        isCaseMessage: true      // optional flag if you want styling
      };

      // Put complaint first, then API messages
      setMessages([complaintMessage, ...apiMessages]);

    } catch (err) {
      console.error("Failed to load messages", err);
    }

  };

  const sendMessage = async () => {

    if (!text || !selectedCase) return;

    const res = await axios.post(
      `http://localhost:8080/api/messages/${selectedCase.id}/${userId}`,
      {
        text: text
      }
    );

    setMessages(prev => [...prev, res.data]);

    setText("");

  };

  return (

    <Layout style={{ height: "100vh", overflow: "hidden" }}>

      {/* LEFT PANEL */}
      <Sider width={320} style={{ background: "#fff" }}>

        <div style={styles.sidebarHeader}>
          Complaints
        </div>

        <List
          dataSource={cases}
          renderItem={(item) => (

            <List.Item
              onClick={() => selectCase(item)}
              style={{
                ...styles.chatUser,
                background:
                  selectedCase?.id === item.id ? "#00bfff" : "transparent",
                color:
                  selectedCase?.id === item.id ? "#fff" : "#000",
                borderRadius: selectedCase?.id === item.id ? "12px" : "0",
                margin: selectedCase?.id === item.id ? "6px 10px" : "0"
              }}
            >

              <List.Item.Meta

                avatar={
                  <Avatar
                    size={48}
                    src={
                      role === "CUSTOMER"
                        ? item.business?.profileImage || null
                        : item.user?.profileImage || null
                    }
                  >
                    {role === "BUSINESS"
                      ? item.user?.name?.[0]
                      : item.companyName?.[0]}
                  </Avatar>
                }

                title={
                  role === "BUSINESS"
                    ? item.user?.name
                    : item.companyName
                }

                description={
                  <div
                    style={{
                      ...styles.complaintPreview,
                      color: selectedCase?.id === item.id ? "#fff" : "#666"
                    }}
                  >
                    {item.complaint}
                  </div>
                }

              />

            </List.Item>

          )}
        />

      </Sider>

      {/* CHAT AREA */}
      <Content style={{ ...styles.chatContainer, height: "100vh" }}>

        {/* HEADER */}
        <div style={styles.chatHeader}>

          {selectedCase
            ? role === "BUSINESS"
              ? `${selectedCase.user?.name} - ${selectedCase.companyName}`
              : selectedCase.companyName
            : "Select a complaint to view details"}

        </div>

        {/* CHAT BODY */}
        <div style={styles.chatBody}>

          {!selectedCase ? (

            <div style={styles.emptyChat}>
              Select a Complaint
            </div>

          ) : (

            messages.map((msg, index) => {
              const isLastMessage = index === messages.length - 1;
              const isBusinessMessage = msg.sender?.id != userId;
              const isMe = msg.sender?.id == userId;

              return (
                <div
                  key={index}
                  style={{
                    textAlign: isMe ? "right" : "left",
                    marginBottom: 14
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: msg.isCaseMessage
                        ? "#00bfff"
                        : (isMe ? "#dcf8c6" : "#fff"),
                      color: msg.isCaseMessage ? "#fff" : "#000",
                      padding: 12,
                      borderRadius: 10,
                      maxWidth: "60%",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.15)"
                    }}
                  >

                    {msg.text && (
                      <div style={{ marginBottom: msg.imageBase64 ? 8 : 0 }}>
                        {msg.text}
                      </div>
                    )}

                    {msg.imageBase64 && (
                      <Image
                        src={msg.imageBase64}
                        width={220}
                        preview
                        style={{ borderRadius: 8 }}
                      />
                    )}

                  </div>
                </div>
              );
            })

          )}

        </div>

        {/* INPUT */}
        {selectedCase && (
          <div style={styles.chatInput}>

            <Input
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPressEnter={sendMessage}
              style={{
                borderRadius: 20
              }}
            />

            <Button type="primary" onClick={sendMessage}>
              Send
            </Button>

          </div>
        )}
        <Modal
          title="How do you feel about the resolution?"
          open={isMoodModalOpen}
          footer={null}
          onCancel={() => setIsMoodModalOpen(false)}
          centered
          width={580}
        >

          <div className="emoji-container">
            {moods.map((mood) => (
              <div
                key={mood.key}
                className="emoji-box"
                onClick={() => {
                  submitMood(mood.key);
                  setIsMoodModalOpen(false);
                }}
              >
                <span className="emoji">{mood.emoji}</span>
                <span className="emoji-label">{mood.label}</span>
              </div>
            ))}
          </div>

        </Modal>

      </Content>

    </Layout>

  );

};

const styles = {

  sidebarHeader: {
    padding: 16,
    fontWeight: 600,
    borderBottom: "1px solid #eee",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  chatUser: {
    padding: "12px 20px",
    cursor: "pointer",
    transition: "0.2s",
    borderBottom: "1px solid #f0f0f0"
  },

  chatContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    background: "#e5ddd5"
  },

  chatHeader: {
    padding: 16,
    background: "#fff",
    borderBottom: "1px solid #eee",
    fontWeight: 600,
    flexShrink: 0,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  chatBody: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    paddingBottom: 120,
    minHeight: 0,
    scrollbarWidth: "none",
    backgroundImage: `
    linear-gradient(rgba(255,255,255,0.9), rgba(146, 157, 223, 0.9)),
    url(${chatBg})
  `,
    backgroundRepeat: "repeat",
    backgroundSize: "800px"
  },

  emptyChat: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    fontWeight: 600,
    color: "#999",
    textAlign: "center"
  },

  chatInput: {
    position: "absolute",
    bottom: 80,
    left: "50%",
    transform: "translateX(-50%)",
    width: "70%",
    display: "flex",
    gap: 10,
    padding: 10,
    background: "#fff",
    borderRadius: 30,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    zIndex: 10
  },

  complaintPreview: {
    fontSize: 13,
    color: "#666",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },

};

export default CasePage;