import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Broadcast from './components/Broadcast';
import FourOFour from './components/404';



function App() {

  const [broadcast, setBroadcast] = useState({});
  const [url, setUrl] = useState('/b/:broadcast');

  // Function to get broadcast from backend server
  async function getBroadcast (id) {
    // Call backend API
    const response = await fetch('/api/get-broadcast', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"broadcastId": id}) // Stringify to JSON before posting
    });
    if (response.ok) { // If response is ok (200 range)
      const broadcastObj = await response.json(); // Parse JSON response
      setBroadcast(broadcastObj); // Set broadcast object as state
    } else { setUrl('/');}; // Else if broadcast does not exist in DB, send user to 404
  };


  return (
    <Router>
      <Navbar/>
      <Switch>
        <Route exact path='/'> {/* If user visits root, redict to homepage */}
          <Homepage/>
        </Route>
        <Route exact path={url}> {/* If user visits broadcast page, check if broadcast exists in db */}
          <Broadcast broadcast={broadcast} getBroadcast={getBroadcast}/>
        </Route>
        <Route path='/'> {/* If user visits any page not specified, redirect to 404 */}
          <FourOFour/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
