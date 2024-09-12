import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import Auth from "./pages/auth";
import { useAppstore } from "./store";
import { apiclient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppstore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"></Navigate>;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppstore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat"></Navigate> : children;
};
function App() {
  const { userInfo, setUserInfo } = useAppstore();
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiclient.get(GET_USER_INFO, {
          withCredentials: true,
        });
      //  console.log(res);
     
        if (res.status === 200 && res.data.id) {
          setUserInfo(res.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
        console.log({ error });
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (Loading) {
    return <div>Loading.......</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        ></Route>

        <Route path="*" element={<Navigate to="/auth" />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
