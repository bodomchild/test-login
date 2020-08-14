import React from "react";
import moment from "moment";
import localization from "moment/locale/es";
import { logout, loggedUser } from "../../api/auth";

import "./Home.scss";

export default function Home(props) {
  const { setRefreshCheckLogin } = props;
  const salir = () => {
    logout();
    setRefreshCheckLogin(true);
  };

  const user = loggedUser();

  return (
    <div className="container">
      <h2>HOME</h2>
      <div>
        {user && (
          <>
            <p>{`Hola ${user.nombre} ${user.apellido}`}</p>
            <p>{`Email: ${user.email}`}</p>
            <p>{`Estás registrado desde ${moment(user.fechaRegistro)
              .locale("es", localization)
              .format("LLL")}`}</p>
          </>
        )}
      </div>
      <span className="logout" onClick={salir}>
        Cerrar sesión
      </span>
    </div>
  );
}
