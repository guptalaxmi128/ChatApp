import { createContext, useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import {
  getRequest,
  baseUrl,
  postReq,
  getRequestById,
} from "../utils/Services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user, authToken }) => {
  const [userChats, setUserChats] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [newSocket, setNewSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);

  const socket = useMemo(() => io("http://localhost:5000"), []);

  useEffect(() => {
    socket.on("connect", () => {
      setNewSocket(socket);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (newSocket === null) return;
    if (!user || !user.data || !user.data.id) return;
    newSocket.emit("onlineUser", user.data.id);
    newSocket.on("getOnlineUser", (res) => {
      setOnlineUser(res);
    });
    return ()=>{
      newSocket.off("getOnlineUser")
    }
  }, [newSocket]);

  console.log("onlineUsers", onlineUser);
  useEffect(() => {
    const getUserChats = async () => {
      if (user) {
        setChatLoading(true);
        setChatError(null);
        const res = await getRequest(`${baseUrl}/getUserChat`, authToken);
        console.log("getuserChat", res);
        setChatLoading(false);
        if (res.error) {
          return setChatError(res);
        }
        setUserChats(res.data);
      }
    };

    getUserChats();
  }, [user, authToken]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!authToken) {
        return;
      }
      setChatLoading(true);
      setChatError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2));
        const res = await getRequest(`${baseUrl}/users`, authToken);
        if (res.error) {
          setChatError(res.error);
          setAllUsers([]);
        } else {
          setAllUsers(res);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setChatError("Error fetching users. Please try again.");
      } finally {
        setChatLoading(false);
      }
    };

    if (authToken) {
      setTimeout(() => {
        fetchAllUsers();
      }, 2); // Fire fetchAllUsers after 2 milliseconds
    }
  }, [authToken]);

  const handleCreatePrivateChat = async (otherUserId) => {
    if (user) {
      setChatLoading(true);
      setChatError(null);
      try {
        const res = await postReq(
          `${baseUrl}/createPrivateChat`,
          { secondId: otherUserId },
          authToken
        );
        // console.log("chatContext", res);
        setChatLoading(false);
        if (res.error) {
          setChatError(res);
          return null;
        }
        return res;
      } catch (error) {
        setChatLoading(false);
        setChatError({ error: true, message: error.message });
        return null;
      }
    }
  };

  const handleSendMessage = async (chatId, message) => {
    if (user) {
      setChatLoading(true);
      setChatError(null);
      try {
        const res = await postReq(
          `${baseUrl}/createMessage`,
          { chatId, message },
          authToken
        );
        console.log(res)
        setChatLoading(false);
        if (res.error) {
          setChatError(res);
          return null;
        }
        // Update local state with the new message
        setUserChats((prevChats) => {
          const updatedChats = { ...prevChats };
          if (updatedChats[chatId]) {
            updatedChats[chatId].messages.push(res.message);
          } else {
            updatedChats[chatId] = { messages: [res.message] };
          }
          return updatedChats;
        });
        return res;
      } catch (error) {
        setChatLoading(false);
        setChatError({ error: true, message: error.message });
        return null;
      }
    }
  };

  const getChatById = async (id) => {
    if (user && authToken) {
      setChatLoading(true);
      setChatError(null);
      try {
        const res = await getRequestById(`${baseUrl}/messages`, id, authToken);
        console.log("chatContext",res)
        setChatLoading(false);
        if (res.error) {
          setChatError(res);
          return null;
        }
        return res;
      } catch (error) {
        setChatLoading(false);
        setChatError({ error: true, message: error.message });
        return null;
      }
    }
  };

  return (
    <>
      <ChatContext.Provider
        value={{
          userChats,
          chatLoading,
          chatError,
          allUsers,
          handleCreatePrivateChat,
          handleSendMessage,
          getChatById,
          onlineUser
        }}
      >
        {children}
      </ChatContext.Provider>
    </>
  );
};
