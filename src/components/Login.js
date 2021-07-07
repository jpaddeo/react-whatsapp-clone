import React from "react";

import Button from "@material-ui/core/Button";

import "./Login.css";
import { firebaseAuth, firebaseAuthProvider } from "../hooks/useFirebase";
import { useStateValue } from "../providers/StateProvider";
import { actionTypes } from "../providers/reducer";

const Login = () => {
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    firebaseAuth
      .signInWithPopup(firebaseAuthProvider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div className="Login">
      <div className="Login__Container">
        <div className="Login__text">Sign in to WhatsApp</div>

        <Button onClick={signIn}>Sign In With Google</Button>
      </div>
    </div>
  );
};

export default Login;
