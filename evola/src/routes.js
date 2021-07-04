import React from 'react';
import { Switch, Route, BrowserRouter as Router} from 'react-router-dom';

import FreightingPage from './components/freighting-page';
import MainPage from './components/main-page';
import NavigationBar from './components/nav-bar';

const Routes = () => {
  return (
    <div className="min-h-screen bg-gray-300">
    <Router>
      <div>
        <NavigationBar/>
        <hr />
        <div className="container mx-auto">
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/freighting">
            <FreightingPage />
          </Route>
        </Switch>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default Routes;