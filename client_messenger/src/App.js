import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import LandingPage from './containers/LandingPage/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Route path="/">
        <LandingPage/>
      </Route>
    </BrowserRouter>
  );
}

export default App;
