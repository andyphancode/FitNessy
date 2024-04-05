import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button} from "reactstrap";
import "./Login.css";

/**
 * 
 *  Login form which calls login function prop. On successful login, redirects to /.
 * 
 */

function Login({ login }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await login(formData);
    if (result.success) {
      navigate("/home")
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <Form className="Login" onSubmit={handleSubmit}>
      <h1 className="mb-3">Log In</h1>
      <FormGroup floating>
        <Input
          id="username"
          name="username"
          placeholder="Username"
          type="username"
          onChange={handleChange}
          value={formData.username}
          required
          autoComplete='off'
        />
        <Label for="username">
          Username
        </Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          required
          autoComplete='off'
        />
        <Label for="password">
          Password
        </Label>
      </FormGroup>
      {formErrors.length ?
        (formErrors.map(err => (
          <p>{err}</p>
        ))) :
        null
      }
      <Button color="primary">
        Login
      </Button>
    </Form>
  );
};

export default Login;