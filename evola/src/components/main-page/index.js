import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import ContractsPage from '../contracts-page';
import NavigationBar from '../nav-bar';
import FooterControl from '../footer-control';
import NoMatchPage from '../NoMatch-Page';

const MainPage = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="flex flex-col h-screen justify-between">
            <NavigationBar />
            <div className="container mx-auto py-8 px-4 md:py-16 md:px-8">
              <ContractsPage />
            </div>
            <FooterControl />
          </div>
        </Route>
        <Route path="*">
          <div className="flex flex-col h-screen justify-between">
            <NavigationBar />
            <div className="container mx-auto py-8 px-4 md:py-16 md:px-8">
              <NoMatchPage/>
            </div>
            <FooterControl />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default MainPage;