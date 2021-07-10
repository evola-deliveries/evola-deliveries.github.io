import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import ContractsPage from '../contracts-page';
import NavigationBar from '../nav-bar';
import FooterControl from '../footer-control';
import NoMatchPage from '../NoMatch-Page';

const MainPage = () => {
  return (
    <Router>
      <div className="bg-cover h-full" style={
        { 
          "backgroundImage": "url(https://images.pexels.com/photos/41951/solar-system-emergence-spitzer-telescope-telescope-41951.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260)",
          "background-position": "center",
          "background-repeat": "repeat",
          "background-size": "cover"
        }}>
        <Switch>
          <Route exact path="/">
            <div className="flex flex-col h-full justify-between">
              <NavigationBar />
              <div className="container mx-auto py-8 px-4 md:py-16 md:px-8">
                <ContractsPage />
              </div>
              <FooterControl />
            </div>
          </Route>
          <Route path="*">
            <div className="flex flex-col h-full justify-between">
              <NavigationBar />
              <div className="container mx-auto py-8 px-4 md:py-16 md:px-8">
                <NoMatchPage />
              </div>
              <FooterControl />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default MainPage;