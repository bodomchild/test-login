import React, { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { size, values } from "lodash";
import Swal from "sweetalert2";
import { isEmailValid } from "../../utils/validations";
import { signUp } from "../../api/auth";

import "./SignUp.scss";

export default function SignUp(props) {
  const { setMode } = props;
  const [formData, setFormData] = useState(initialFormValue());
  const [signUpLoading, setSignUpLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    let validCount = 0;

    values(formData).some((value) => {
      value && validCount++;
      return null;
    });

    if (validCount !== size(formData)) {
      Swal.fire({
        title: "Error en el login",
        html: "Ingresa todos los datos",
        icon: "error",
      });
    } else {
      if (!isEmailValid(formData.email)) {
        Swal.fire(
          "Ingresa un email válido",
          `<span class="text-muted">Formato válido: ejemplo@mail.com</span>`,
          "warning"
        );
      } else if (formData.password !== formData.repeatPassword) {
        Swal.fire("Las contraseñas deben coincidir", "", "warning");
      } else if (size(formData.password < 6)) {
        Swal.fire(
          "La contraseña debe tener al menos 6 caracteres",
          "",
          "warning"
        );
      } else {
        setSignUpLoading(true);
        signUp(formData)
          .then((res) => {
            if (res.code) {
              Swal.fire(res.message);
            } else {
              let timerInterval;
              Swal.fire({
                title: "Registrado con éxito",
                html: `<small>Redirigiendo en <strong></strong> segundos</small>`,
                timer: 5000,
                timerProgressBar: true,
                onBeforeOpen: () => {
                  Swal.showLoading();
                  timerInterval = setInterval(() => {
                    const content = Swal.getContent();
                    if (content) {
                      const st = content.querySelector("strong");
                      if (st) {
                        st.textContent = parseInt(
                          (Swal.getTimerLeft() / 1000).toString(),
                          10
                        );
                      }
                    }
                  }, 100);
                },
                onClose: () => {
                  clearInterval(timerInterval);
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then(() => {
                setMode("login");
              });
            }
          })
          .catch(() => {
            Swal.fire("Error del servidor, intente más tarde", "", "error");
          })
          .finally(() => {
            setSignUpLoading(false);
          });
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = () => {
    setMode("login");
  };

  return (
    <div className="sign-up-form">
      <h2>Registrate</h2>
      <Form onSubmit={onSubmit} onChange={onChange} noValidate>
        <Form.Group>
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Nombre"
                defaultValue={formData.nombre}
                name="nombre"
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Apellido"
                defaultValue={formData.apellido}
                name="apellido"
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            defaultValue={formData.email}
          />
        </Form.Group>
        <Form.Group>
          <Row>
            <Col>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                name="password"
                defaultValue={formData.password}
              />
            </Col>
            <Col>
              <Form.Control
                type="password"
                placeholder="Repetir contraseña"
                name="repeatPassword"
                defaultValue={formData.repeatPassword}
              />
            </Col>
          </Row>
        </Form.Group>
        <Button variant="primary" type="submit">
          {!signUpLoading ? "Registrarse" : <Spinner animation="border" />}
        </Button>
        <span className="change">
          ¿Ya tenés cuenta?{" "}
          <span className="__link" onClick={login}>
            Iniciar sesión
          </span>
        </span>
      </Form>
    </div>
  );
}

function initialFormValue() {
  return {
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repeatPassword: "",
  };
}
