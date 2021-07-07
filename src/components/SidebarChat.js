import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";

import "./SidebarChat.css";
import firebaseDb from "../hooks/useFirebase";

const SidebarChat = ({ id, name }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (id) {
      firebaseDb
        .collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) => {
          setMessages(snap.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  return (
    <Link to={`/rooms/${id}`}>
      <div className="SidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="SidebarChat__Info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  );
};

export default SidebarChat;
