import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Broadcast from './components/Broadcast';

function App() {
  return (
    <Router>
      <Navbar/>
      <Switch>
        <Route exact path='/'>
          <Homepage/>
        </Route>
        <Route exact path='/b/:broadcast'>
          <Broadcast/>
        </Route>
        <Route path='/'>
          <h1 style={{marginTop: '5vh'}}>404</h1>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
