import { createContext, useCallback, useState, useEffect } from "react";
import { postRequest, baseUrl } from "../utils/Services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  console.log("user", user);
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      try {
        const res = await postRequest(
          `${baseUrl}/register`,
          JSON.stringify(registerInfo)
        );
        setIsRegisterLoading(false);
        if (res.error) {
          return setRegisterError(res);
        }
        localStorage.setItem("User", JSON.stringify(res));
        setUser(res);
      } catch (error) {
        setIsRegisterLoading(false);
        setRegisterError({ error: true, message: error.message });
      }
    },
    [registerInfo]
  );

  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const res = await postRequest(
          `${baseUrl}/login`,
          JSON.stringify(loginInfo)
        );
        setIsLoading(false);
        if (res.error) {
          return setError(res);
        }
        localStorage.setItem("User", JSON.stringify(res));
        setUser(res);
      } catch (error) {
        setIsLoading(false);
        setError({ error: true, message: error.message });
      }
    },
    [loginInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        isLoading,
        error,
        updateLoginInfo,
        loginInfo,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
