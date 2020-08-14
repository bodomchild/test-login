import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { size, values } from "lodash";
import { isEmailValid } from "../../utils/validations";
import { signIn, setToken } from "../../api/auth";
import Swal from "sweetalert2";

import "./Login.scss";

export default function Login(props) {
  const { setRefreshCheckLogin, setMode } = props;
  const [formData, setFormData] = useState(initialFormValue());
  const [loginLoading, setLoginLoading] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    let validCount = 0;

    values(formData).some((value) => {
      value && validCount++;
      return null;
    });

    if (validCount !== size(formData)) {
      Swal.fire({
        title: "Error en el login",
        html: "Ingresa tu correo y contraseña",
        icon: "error",
      });
    } else {
      if (!isEmailValid(formData.email)) {
        Swal.fire(
          "Ingresa un email válido",
          `<span class="text-muted">Formato válido: ejemplo@mail.com</span>`,
          "warning"
        );
      } else {
        setLoginLoading(true);
        signIn(formData)
          .then((res) => {
            if (res.message) {
              Swal.fire(res.message);
            } else {
              setToken(res.token);
              setRefreshCheckLogin(true);
            }
          })
          .catch(() => {
            Swal.fire("Error del servidor, intente más tarde", "", "error");
          })
          .finally(() => {
            setLoginLoading(false);
          });
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const register = () => {
    setMode("signup");
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <Form onSubmit={submitForm} onChange={onChange} noValidate>
        <Form.Group>
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            defaultValue={formData.email}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            name="password"
            defaultValue={formData.password}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {!loginLoading ? "Iniciar sesión" : <Spinner animation="border" />}
        </Button>
        <span className="change" onClick={register}>
          Registrarse
        </span>
      </Form>
    </div>
  );
}

function initialFormValue() {
  return {
    email: "",
    password: "",
  };
}
