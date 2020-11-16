import { useHistory } from "react-router-dom";
import '../styles/style.css';
import profile from '../assets/guest_profile_picture.png';

function BroadcastTile (props) {

  // Import useHistory for redirect functionality
  const history = useHistory();

  return (
      <div className="broadcast-tile">
        <div className="broadcast-thumb" style={{background: `url('${props.broadcast.thumbnailUrl}') center no-repeat `, backgroundSize: 'cover' }}>
        </div>
        <div className="broadcast-details">
          <div className="broadcast-profilepic">
            <img src={profile} alt="" />
          </div>
          <div className="broadcast-title-owner">
            <h3>{props.broadcast.title}</h3>
            <p>{props.broadcast.owner}</p>
          </div>
        </div>
      </div>
  )
}

export default BroadcastTile;

