import { useState, useEffect } from 'react';
import '../styles/style.css';
import Chat from './Chat';
import Videoplayer from './Videoplayer';

import io from 'socket.io-client';
let socket;


function Broadcast() {

  const [msg, setMsg] = useState('');
  const [currentTime, setCurrentTime] = useState(0);


  useEffect ( () => {
    //Connect to room-specific socket
    socket = io.connect();
    socket.emit('join', window.location.pathname);
    //Get current timestamp for this room
    socket.emit('get current time', {room: window.location.pathname});
    // On component unmount, close socket
    return () => {
      socket.close();
    }
  }, []);


  useEffect ( () => {
    //Store incoming time update in state
    socket.on('current time', time => {
      setCurrentTime(time);
    });
    // Listens for new chat messages from server
    socket.on('chat message to client', msg => {
      setMsg(msg);
    });
  }, []);


  // Sends new messages (from Chat) to server
  const emitMsg = (msg) => {
    socket.emit('chat message to server', {room: window.location.pathname, msg: msg});
  };

  return (
    <div className="broadcast">
      <Videoplayer currentTime={currentTime}/>
      <Chat emitMsg={emitMsg} msg={msg}/>
    </div>
  )
}

export default Broadcast;