import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { ListGroup, Container, Row, Col, Form, Button } from "react-bootstrap";
// import Avatar from "react-avatar"; 

const Chat = () => {
  const {
    userChats,
    chatLoading,
    chatError,
    allUsers,
    handleCreatePrivateChat,
    handleSendMessage,
    getChatById,
    onlineUser
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState("");



  const users = allUsers?.data || [];


  // console.log("userChat",userChats)
  const handleUserClick = async (user) => {
    let chat;
    if (!chat) {
      chat = await handleCreatePrivateChat(user.id);
      // console.log("handleUser", chat);
      if (chat) {
        setChatId(chat.id); 
      }
    } else {
      setChatId(chat.id); 
    }
  };

  console.log(chatId)


  useEffect(() => {
    const fetchChat = async () => {
      if (chatId) {
        const chatData = await getChatById(chatId);
        console.log("chatData",chatData)
        if (chatData) {
          setSelectedChat(chatData);
        }
      }
    };

    fetchChat();
  }, [chatId]);

  const handleMessageSend = async () => {
    if (chatId) {
      const newMessage = await handleSendMessage(chatId, message);
      if (newMessage) {
        setSelectedChat(newMessage);
        setMessage("");
      }
    }
  };

  if (chatLoading) {
    return <div>Loading...</div>;
  }

  if (chatError) {
    return <div>Error: {chatError.message}</div>;
  }

  console.log("chat",users)
  return (
    <Container fluid>
      <Row style={{ height: "100vh" }}>
        <Col xs={3} style={{ backgroundColor: "#333", padding: "10px" }}>
          <h4 style={{ color: "#fff" }}>Users</h4>
          <ListGroup variant="flush">
            {users.map((user) => (
              <ListGroup.Item
                key={user.id}
                action
                onClick={() => handleUserClick(user)}
                style={{
                  cursor: "pointer",
                  color: "#fff",
                  backgroundColor: "#444",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* <Avatar
                  name={user.fullName} // Use user data for avatar display
                  size="30"
                  round={true}
                  style={{ marginRight: "10px" }}
                /> */}
                {user.fullName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        
        {/* <h4 style={{ color: "#fff", marginTop: "20px" }}>Online Users</h4>
          <ListGroup variant="flush">
            {onlineUser?.onlineUser.map((onlineUser) => {
              const user = users.find(u => u.id === onlineUser.userId);
              if (!user) return null;
              return (
                <ListGroup.Item
                  key={onlineUser.userId}
                  style={{
                    color: "#fff",
                    backgroundColor: "#555",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    position: "relative", // To position the green dot
                  }}
                >
                  <span
                    style={{
                      height: "10px",
                      width: "10px",
                      backgroundColor: "green",
                      borderRadius: "50%",
                      display: "inline-block",
                      position: "absolute", // To position the green dot
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  ></span>
                  <span style={{ marginLeft: "20px" }}>{user.fullName}</span>
                </ListGroup.Item>
              );
            })}
          </ListGroup> */}
        </Col>
        <Col
          xs={9}
          style={{ backgroundColor: "#222", color: "#fff", padding: "10px" }}
        >
          {selectedChat ? (
            <>
              <h4>{selectedChat.fullName}</h4>
              <div
                style={{
                  height: "80%",
                  overflowY: "scroll",
                  padding: "10px",
                  backgroundColor: "#333",
                }}
              >
                {selectedChat ? (
                  selectedChat.map((chat, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "10px",
                        textAlign: chat.senderId === user.data.id ? "right" : "left", // Align messages based on sender
                      }}
                    >
                      <div>{chat.message}</div>
                      <div style={{ fontSize: "0.8em", color: "#bbb" }}>
                        {chat.timestamp}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No messages found</div>
                )}
              </div>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleMessageSend();
                }}
              >
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      backgroundColor: "#555",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ marginTop: "10px" }}
                >
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <div>Please select a user to start a chat</div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
