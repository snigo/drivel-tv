import { useState, useEffect } from 'react';
import '../styles/style.css';
import YouTube from 'react-youtube';


function Videoplayer(props) {

  const [time, setTime] = useState(0);

  // When current timestamp comes in from props, set it as state
  useEffect ( () => {
    setTime(props.currentTime)
  }, [props.currentTime]);

  //Define YouTube player options and assign start time from state
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      'enablejsapi': 1,
      'playsinline': 1,
      'webkit-playsinline': 1,
      'autoplay': 1,
      'start': time,
    },
  }

  return (
    <YouTube containerClassName={'videoplayer'} videoId='oOBJ-sIw4W8' opts={opts} />
  )
}

export default Videoplayer;