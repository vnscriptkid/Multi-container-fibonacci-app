import React from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Fib from './Fib';
import Feature from './Feature';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header__linkList">
            <Link className="header__link" to="/">Home</Link>
            <Link className="header__link" to="/feature">Feature</Link>
          </div>
        </header>
        <Route path="/" exact component={Fib}/>
        <Route path="/feature" exact component={Feature}/>
      </div>
    </Router>
  );
}

export default App;
