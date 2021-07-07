import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

import firebase from "firebase";

import "./Chat.css";
import firebaseDb from "../hooks/useFirebase";
import { useStateValue } from "../providers/StateProvider";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (roomId) {
      firebaseDb
        .collection("rooms")
        .doc(roomId)
        .onSnapshot((snap) => setRoomName(snap.data().name));
      firebaseDb
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snap) => setMessages(snap.docs.map((doc) => doc.data())));
    }
  }, [roomId]);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const handleChangeInputMessage = (ev) => {
    setInputMessage(ev.target.value);
  };
  const handleSendMessage = (ev) => {
    ev.preventDefault();
    firebaseDb.collection("rooms").doc(roomId).collection("messages").add({
      message: inputMessage,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInputMessage("");
  };
  return (
    <div className="Chat">
      <div className="Chat__Header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="Chat__HeaderInfo">
          <h3>{roomName}</h3>
          <p>Last seen at {(new Date(messages[messages.length - 1]?.timestamp?.toDate())).toUTCString()}</p>
        </div>
        <div className="Chat__HeadrRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="Chat__Body">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`Chat__BodyMessage ${
              message.name === user.displayName && "Chat__BodyMessageReceiver"
            }`}
          >
            <span className="Chat_BodyMessageName">{message.name}</span>
            {message.message}
            <span className="Chat_BodyMessageTimestamp">
              {message.timestamp?.toDate().toUTCString()}
            </span>
          </div>
        ))}
      </div>
      <div className="Chat__Footer">
        <InsertEmoticonIcon />
        <form>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={handleChangeInputMessage}
          />
          <button type="submit" onClick={handleSendMessage}>
            Send message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
