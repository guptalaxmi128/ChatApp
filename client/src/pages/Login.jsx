import React, { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { loginInfo, updateLoginInfo, error, loginUser, isLoading } =
    useContext(AuthContext);
  return (
    <>
      <Form onSubmit={loginUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h3>Login</h3>

              <Form.Control
                type="email"
                placeholder="Email"
                value={loginInfo.email}
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                value={loginInfo.password}
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <Button variant="primary" type="submit">
              {isLoading ? "Login your account" : 'Login'}
              </Button>
              {error?.error && <Alert variant="danger"><p>{error.message}</p></Alert>}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
