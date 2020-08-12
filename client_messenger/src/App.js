import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import LandingPage from './containers/LandingPage/LandingPage';
import About from './components/About/About';
import NotFind from './components/NotFind/NotFind';
import Panel from './containers/Panel/Panel';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        { localStorage.token ?
        <Route path="/" exact component={Panel}/> :
        <Route path="/" exact component={LandingPage}/>
        }
        <Route path="/about" component={About}/>
        <Route component={NotFind}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
