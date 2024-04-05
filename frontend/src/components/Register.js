import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Form, FormGroup, Label, Input, Button} from "reactstrap";
import "./Register.css";

/**
 *
 * Signup form while calls signup function prop. Upon successful signup, redirects to /.
 * 
 */

function Register({ signup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signup(formData);
    if (result.success) {
      navigate("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }


  return (
    <Form className="Register" onSubmit={handleSubmit}>
      <h1 className="mb-3">Sign Up</h1>
      <FormGroup floating>
        <Input
          id="username"
          name="username"
          placeholder="Username"
          type="text"
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
      <FormGroup floating>
        <Input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          required
          autoComplete='off'
        />
        <Label for="email">
          Email
        </Label>
      </FormGroup>
      {formErrors.length ?
        formErrors.map((err, index) => (
          <p key={`error-${index}`}>{err}</p> 
        )) :
        null
      }
      <Button color="primary">
        Signup
      </Button>
    </Form>
  );
};

export default Register;