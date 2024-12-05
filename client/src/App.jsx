import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';

function App() {
  const { user } = useContext(AuthContext);
  const authToken = user?.data?.authToken;

  return (
    <Router>
      <ChatContextProvider user={user} authToken={authToken}>
        <NavBar />
        <Container>
          <Routes>
            {/* Protect routes that require authentication */}
            <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            {/* Fallback for any unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </ChatContextProvider>
    </Router>
  );
}

export default App;
