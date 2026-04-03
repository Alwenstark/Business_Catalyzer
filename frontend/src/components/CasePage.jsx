import React, { useState, useEffect, useRef } from "react";
import { Layout, List, Avatar, Input, Button, Image, Modal } from "antd";
import axios from "axios";
import chatBg from "../assets/chat.png";
import BASE_URL from "../api";
axios.defaults.withCredentials = true;

const { Sider, Content } = Layout;

const STATUS_COLORS = {
  OPEN: { color: "#1890ff", bg: "#e6f7ff", border: "#91d5ff" },
  RESOLVED: { color: "#52c41a", bg: "#f6ffed", border: "#b7eb8f" },
  CLOSED: { color: "#8c8c8c", bg: "#f5f5f5", border: "#d9d9d9" },
  REOPENED: { color: "#fa8c16", bg: "#fff7e6", border: "#ffd591" },
};


const RESOLVE_MOODS = [
  { key: "APPRECIATION", emoji: "🙏", label: "Appreciation" },
  { key: "THANK_YOU", emoji: "😊", label: "Thank You" },
  { key: "HAPPY", emoji: "😁", label: "Happy" },
  { key: "NEUTRAL", emoji: "😐", label: "Neutral" },
  { key: "ANGRY", emoji: "😠", label: "Angry" },
  { key: "FRUSTRATED", emoji: "😡", label: "Frustrated" },
];


const REOPEN_MOODS = [
  { key: "NEUTRAL", emoji: "😐", label: "Neutral" },
  { key: "ANGRY", emoji: "😠", label: "Angry" },
  { key: "FRUSTRATED", emoji: "😡", label: "Frustrated" },
];

const CasePage = () => {
  const chatBodyRef = useRef(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);


  const [moodModalMode, setMoodModalMode] = useState(null);
  const role = user?.role;

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!selectedCase) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/messages/${selectedCase.id}`
        );

        const apiMessages = res.data || [];

        const complaintMessage = {
          id: `case-${selectedCase.id}`,
          text: selectedCase.complaint,
          imageBase64: selectedCase.imageBase64,
          sender: selectedCase.user,
          isCaseMessage: true,
        };

        const updatedMessages = [complaintMessage, ...apiMessages];

       
        if (JSON.stringify(updatedMessages) !== JSON.stringify(messages)) {
          setMessages(updatedMessages);
        }

      } catch (err) {
        console.error("Polling messages failed", err);
      }
    }, 2000); 

    return () => clearInterval(interval);

  }, [selectedCase, messages]);

  useEffect(() => {
    if (!selectedCase) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/cases/${selectedCase.id}`
        );

        const updatedCase = res.data;

       
        setSelectedCase(prev => ({
          ...prev,
          status: updatedCase.status,
          mood: updatedCase.mood,
          resolvedMood: updatedCase.resolvedMood,
        }));

        
        setCases(prev =>
          prev.map(c =>
            c.id === updatedCase.id ? { ...c, ...updatedCase } : c
          )
        );

      } catch (err) {
        console.error("Polling status failed", err);
      }
    }, 2000);

    return () => clearInterval(interval);

  }, [selectedCase]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadCases();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/me`);
      setUser(res.data);
    } catch (err) {
      console.error("Not logged in");
    }
  };


  const businessHasRepliedLast = () => {
    if (!messages || messages.length === 0) return false;


    let lastBusinessIdx = -1;
    let lastCustomerIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      const isCustomer = String(messages[i].sender?.id) === String(user?.id);
      if (lastBusinessIdx === -1 && !isCustomer && !messages[i].isCaseMessage) {
        lastBusinessIdx = i;
      }
      if (lastCustomerIdx === -1 && isCustomer) {
        lastCustomerIdx = i;
      }
      if (lastBusinessIdx !== -1 && lastCustomerIdx !== -1) break;
    }

    return lastBusinessIdx > lastCustomerIdx;
  };


  const renderActionButton = () => {
    if (!selectedCase) return null;
    const status = selectedCase.status;

    if (role === "CUSTOMER") {
  
      if ((status === "OPEN" || status === "REOPENED") && businessHasRepliedLast()) {
        return (
          <div style={styles.actionBtnRow("right")}>
            <Button
              style={styles.actionBtn("#52c41a")}
              onClick={() => setMoodModalMode("resolve")}
            >
              Mark as Resolved
            </Button>
          </div>
        );
      }

      if (status === "CLOSED") {
        return (
          <div style={styles.actionBtnRow("right")}>
            <Button
              style={styles.actionBtn("#fa8c16")}
              onClick={() => setMoodModalMode("reopen")}
            >
              Reopen Case
            </Button>
          </div>
        );
      }
    }

    if (role === "BUSINESS" && status === "RESOLVED") {
      return (
        <div style={styles.actionBtnRow("left")}>
          <Button
            style={styles.actionBtn("#8c8c8c")}
            onClick={() => handleStatusChange("CLOSED")}
          >
            Close Case
          </Button>
        </div>
      );
    }

    return null;
  };


  const handleStatusChange = async (status) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/cases/${selectedCase.id}/status`,
        null,
        { params: { status } }
      );
      const updated = res.data;
      setSelectedCase(prev => ({ ...prev, status: updated.status }));
      setCases(prev =>
        prev.map(c => c.id === updated.id ? { ...c, status: updated.status } : c)
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };


  const submitResolveMood = async (moodKey) => {
    try {
      await axios.put(
        `${BASE_URL}/api/cases/${selectedCase.id}/status`,
        null,
        { params: { status: "RESOLVED" } }
      );
      await axios.put(
        `${BASE_URL}/api/cases/${selectedCase.id}/resolvedMood`,
        null,
        { params: { mood: moodKey } }
      );
      setMoodModalMode(null);
      setSelectedCase(prev => ({ ...prev, status: "RESOLVED", resolvedMood: moodKey }));
      setCases(prev =>
        prev.map(c =>
          c.id === selectedCase.id
            ? { ...c, status: "RESOLVED", resolvedMood: moodKey }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };


  const submitReopenMood = async (moodKey) => {
    try {
  
      await axios.put(
        `${BASE_URL}/api/cases/${selectedCase.id}/mood`,
        null,
        { params: { mood: moodKey } }
      );

    
      await axios.put(
        `${BASE_URL}/api/cases/${selectedCase.id}/status`,
        null,
        { params: { status: "REOPENED" } }
      );

     
      const autoText = selectedCase.complaint;
      const res = await axios.post(
        `${BASE_URL}/api/messages/${selectedCase.id}`,
        { text: autoText }
      );

      setMoodModalMode(null);
      setSelectedCase(prev => ({ ...prev, status: "REOPENED", mood: moodKey }));
      setCases(prev =>
        prev.map(c =>
          c.id === selectedCase.id
            ? { ...c, status: "REOPENED", mood: moodKey }
            : c
        )
      );

      setMessages(prev => [...prev, res.data]);

    } catch (err) {
      console.error(err);
    }
  };


  const loadCases = async () => {
    try {
      if (!user) return;

      let res;

      if (user.role === "CUSTOMER") {
        res = await axios.get(`${BASE_URL}/api/cases/my-cases`);
      } else {
        res = await axios.get(`${BASE_URL}/api/cases/company`, {
          params: { name: user.companyName },
        });
      }

      const casesData = res.data;

      const updatedCases = await Promise.all(
        casesData.map(async (c) => {
          try {
            const business = await axios.get(
              `${BASE_URL}/api/business/search?name=${c.companyName}`
            );
            return { ...c, business: business.data[0] };
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

  const isInitialLoad = useRef(false);

  const selectCase = async (caseItem) => {
    isInitialLoad.current = true;
    try {
      setSelectedCase(caseItem);
      const res = await axios.get(`${BASE_URL}/api/messages/${caseItem.id}`);
      const apiMessages = res.data || [];
      const complaintMessage = {
        id: `case-${caseItem.id}`,
        text: caseItem.complaint,
        imageBase64: caseItem.imageBase64,
        sender: caseItem.user,
        isCaseMessage: true,
      };
      setMessages([complaintMessage, ...apiMessages]);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;

    if (isInitialLoad.current) {
      el.scrollTop = el.scrollHeight; 
      isInitialLoad.current = false;
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); 
    }
  }, [messages]);


  const sendMessage = async () => {
    if (!text || !selectedCase) return;
    const res = await axios.post(
      `${BASE_URL}/api/messages/${selectedCase.id}`,
      { text }
    );
    setMessages(prev => [...prev, res.data]);
    setText("");
  };


  const isInputDisabled = () => {
    if (!selectedCase) return true;
    const s = selectedCase.status;
    if (role === "CUSTOMER" && (s === "RESOLVED" || s === "CLOSED")) return true;
    if (role === "BUSINESS" && s === "CLOSED") return true;
    return false;
  };


  const StatusBadge = ({ status }) => {
    if (!status) return null;
    const s = STATUS_COLORS[status] || { color: "#000", bg: "#fff", border: "#ccc" };
    return (
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        letterSpacing: 0.5,
        marginLeft: 8,
      }}>
        {status}
      </span>
    );
  };


  const isReopen = moodModalMode === "reopen";
  const moodList = isReopen ? REOPEN_MOODS : RESOLVE_MOODS;
  const moodTitle = isReopen
    ? "Why are you reopening this case?"
    : "How do you feel about the resolution?";
  const onMoodPick = isReopen ? submitReopenMood : submitResolveMood;

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>

      
      <Sider
        width={320}
        style={{
          background: "#fff",
          height: "100vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        <div style={styles.sidebarHeader}>Complaints</div>

        <List
          dataSource={cases}
          renderItem={(item) => (
            <List.Item
              onClick={() => selectCase(item)}
              style={{
                ...styles.chatUser,
                background: selectedCase?.id === item.id ? "#00bfff" : "transparent",
                color: selectedCase?.id === item.id ? "#fff" : "#000",
                borderRadius: selectedCase?.id === item.id ? "12px" : "0",
                margin: selectedCase?.id === item.id ? "6px 10px" : "0",
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
                    {role === "BUSINESS" ? item.user?.name?.[0] : item.companyName?.[0]}
                  </Avatar>
                }
                title={
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{role === "BUSINESS" ? item.user?.name : item.companyName}</span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 20,
                      background: selectedCase?.id === item.id ? "rgba(255,255,255,0.25)" : STATUS_COLORS[item.status]?.bg,
                      color: selectedCase?.id === item.id ? "#fff" : STATUS_COLORS[item.status]?.color,
                      border: `1px solid ${selectedCase?.id === item.id ? "rgba(255,255,255,0.4)" : STATUS_COLORS[item.status]?.border}`,
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}>
                      {item.status}
                    </span>
                  </span>
                }
                description={
                  <div style={{
                    ...styles.complaintPreview,
                    color: selectedCase?.id === item.id ? "#fff" : "#666",
                  }}>
                    {item.complaint}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Sider>

    
      <Content style={{ ...styles.chatContainer, height: "100vh" }}>

        <div style={styles.chatHeader}>
          <span>
            {selectedCase
              ? role === "BUSINESS"
                ? `${selectedCase.user?.name} - ${selectedCase.companyName}`
                : selectedCase.companyName
              : "Select a complaint to view details"}
          </span>
          {selectedCase && <StatusBadge status={selectedCase.status} />}
        </div>

        <div style={styles.chatBody} ref={chatBodyRef}>
          {!selectedCase ? (

            <div style={styles.emptyChat}>Select a Complaint</div>

          ) : (
            <>
              {messages.map((msg, index) => {
                const isMe = String(msg.sender?.id) === String(user?.id);
                return (
                  <div
                    key={index}
                    style={{ textAlign: isMe ? "right" : "left", marginBottom: 14 }}
                  >
                    <div style={{
                      display: "inline-block",
                      background: msg.isCaseMessage ? "#00bfff" : (isMe ? "#dcf8c6" : "#fff"),
                      color: msg.isCaseMessage ? "#fff" : "#000",
                      padding: 12,
                      borderRadius: 10,
                      maxWidth: "60%",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    }}>
                      {msg.text && (
                        <div style={{ marginBottom: msg.imageBase64 ? 8 : 0 }}>
                          {msg.text}
                        </div>
                      )}
                      {msg.imageBase64 && (
                        <Image src={msg.imageBase64} width={220} preview style={{ borderRadius: 8 }} />
                      )}
                    </div>
                  </div>
                );
              })}

        
              {renderActionButton()}
            </>
          )}
        </div>

      
        {selectedCase && (
          <div style={styles.chatInput}>
            <Input
              placeholder={
                isInputDisabled()
                  ? `Case is ${selectedCase?.status?.toLowerCase()}...`
                  : "Type a message..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPressEnter={!isInputDisabled() ? sendMessage : undefined}
              disabled={isInputDisabled()}
              style={{ borderRadius: 20 }}
            />
            <Button type="primary" onClick={sendMessage} disabled={isInputDisabled()}>
              Send
            </Button>
          </div>
        )}


        <Modal
          title={moodTitle}
          open={moodModalMode !== null}
          footer={null}
          onCancel={() => setMoodModalMode(null)}
          centered
          width={580}
        >
          <div className="emoji-container">
            {moodList.map((mood) => (
              <div key={mood.key} className="emoji-box" onClick={() => onMoodPick(mood.key)}>
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
  actionBtnRow: (align) => ({
    display: "flex",
    justifyContent: align === "right" ? "flex-end" : "flex-start",
    marginTop: 6,
    marginBottom: 14,
    paddingRight: align === "right" ? 4 : 0,
    paddingLeft: align === "left" ? 4 : 0,
  }),
  actionBtn: (color) => ({
    background: color,
    border: "none",
    borderRadius: 20,
    fontWeight: 600,
    color: "#fff",
    padding: "0 20px",
    height: 38,
    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    cursor: "pointer",
  }),
  sidebarHeader: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "#fff",
    padding: 16,
    fontWeight: 600,
    borderBottom: "1px solid #eee",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  chatUser: {
    padding: "12px 20px",
    cursor: "pointer",
    transition: "0.2s",
    borderBottom: "1px solid #f0f0f0",
  },
  chatContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    background: "#e5ddd5",
  },
  chatHeader: {
    padding: 16,
    background: "#fff",
    borderBottom: "1px solid #eee",
    fontWeight: 600,
    flexShrink: 0,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
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
    backgroundSize: "800px",
  },
  emptyChat: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    fontWeight: 600,
    color: "#999",
    textAlign: "center",
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
    zIndex: 10,
  },
  complaintPreview: {
    fontSize: 13,
    color: "#666",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
};

export default CasePage;