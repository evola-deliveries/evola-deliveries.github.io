import React from 'react';
import { Switch, Route, BrowserRouter as Router} from 'react-router-dom';

import FreightingPage from './components/freighting-page';
import MainPage from './components/main-page';
import NavigationBar from './components/nav-bar';

const Routes = () => {
  return (
    <Router>
      <div>
        <NavigationBar/>
        <hr />
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/freighting">
            <FreightingPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;