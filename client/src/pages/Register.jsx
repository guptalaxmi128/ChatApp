import { useContext } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { registerInfo, updateRegisterInfo, registerError, registerUser, isRegisterLoading } = useContext(AuthContext);

  return (
    <Form onSubmit={registerUser}>
      <Row style={{ height: '100vh', justifyContent: 'center', paddingTop: '10%' }}>
        <Col xs={6}>
          <Stack gap={3}>
            <h3>Register</h3>
            <Form.Control
              type="text"
              placeholder="Name"
              value={registerInfo.fullName}
              onChange={(e) => updateRegisterInfo({ ...registerInfo, fullName: e.target.value })}
            />
            <Form.Control
              type="text"
              placeholder="Mobile Number"
              value={registerInfo.mobileNumber}
              onChange={(e) => updateRegisterInfo({ ...registerInfo, mobileNumber: e.target.value })}
            />
            <Form.Control
              type="email"
              placeholder="Email"
              value={registerInfo.email}
              onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}
            />
            <Form.Control
              type="password"
              placeholder="Password"
              value={registerInfo.password}
              onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })}
            />
            <Button variant="primary" type="submit">
              {isRegisterLoading ? "Creating your account" : 'Register'}
            </Button>
            {registerError?.error && <Alert variant="danger"><p>{registerError.message}</p></Alert>}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}

export default Register;
