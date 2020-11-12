
import { useState, useEffect } from 'react';
import '../styles/style.css';
import $ from 'jquery';


function Chat(props) {

  const [msg, setMsg] = useState('');

  // Appends new messages (from server -> Broadcast component) to list
  useEffect(() => {
    $('#chatList').append($('<li>').text(props.msg));
  }, [props.msg]);


  return (
    <div className="chat">
      <ul id="chatList"></ul>
      <form id="chatForm" action="" onSubmit={ (e) => {
        e.preventDefault(); // Prevent page reloading
        if(msg === '') return; // Do not emit message if input is empty
        console.log('props', props);
        props.emitMsg(msg); // Call emit function in Broadcast component
        setMsg(''); // Clear input box
      }}>
        <input id="chatInput" autocomplete="off" value={msg} onChange={ (e) => setMsg(e.target.value)}/>
        <button id="chatButton">Send</button>
      </form>
    </div>
  )
}

export default Chat;