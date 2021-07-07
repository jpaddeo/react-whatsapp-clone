import React, { useState, useEffect } from "react";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import firebaseDb from "../hooks/useFirebase";
import { useStateValue } from "../providers/StateProvider";

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    const unsuscribe = firebaseDb.collection("rooms").onSnapshot((snap) => {
      setRooms(
        snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
      return () => {
        unsuscribe();
      };
    });
  }, []);

  const createChat = (ev) => {
    ev.preventDefault();
    const roomName = prompt("Please enter the chat room name");

    if (roomName) {
      firebaseDb.collection("rooms").add({
        name: roomName,
      });
    }
  };
  return (
    <div className="Sidebar">
      <div className="Sidebar__Header">
        <Avatar src={user?.photoURL} />
        <div className="Sidebar__HeaderRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton onClick={createChat}>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="Sidebar__Search">
        <div className="Sidebar__SearchContainer">
          <SearchOutlinedIcon />
          <input placeholder="Search or stat new chat" type="text" />
        </div>
      </div>
      <div className="Sidebar__Chats">
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
