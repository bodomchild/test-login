import jwtDecode from "jwt-decode";
import { HOST, TOKEN } from "../utils/constants";

export function signUp(user) {
  const url = `${HOST}/sign-up`;
  const userTemp = {
    ...user,
    email: user.email.toLowerCase(),
    fechaNacimiento: new Date(),
  };

  delete userTemp.repeatPassword;

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userTemp),
  };

  return fetch(url, params)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      }
      return {
        code: res.status,
        message: "Error de registro",
      };
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}

export function signIn(user) {
  const url = `${HOST}/login`;
  const data = {
    ...user,
    email: user.email.toLowerCase(),
  };

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "applciation/json",
    },
    body: JSON.stringify(data),
  };

  return fetch(url, params)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      }
      return { message: "Usuario o contraseña incorrectos" };
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}

export function setToken(token) {
  localStorage.setItem(TOKEN, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN);
}

export function logout() {
  localStorage.removeItem(TOKEN);
}

export function loggedUser() {
  const token = getToken();

  if (!token) {
    logout();
    return null;
  }

  if (isTokenExpired(token)) {
    logout();
    return null;
  }

  return jwtDecode(token);
}

function isTokenExpired(token) {
  const { exp } = token;
  const expires = exp * 1000;
  const timeout = expires - Date.now();

  if (timeout < 0) {
    return true;
  }

  return false;
}
