import React from 'react';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import ContractsPage from '../contracts-page';

export default function FreightingPage() {
  let { path, url } = useRouteMatch();

  return (
    <Switch>
        <Route exact path={path}>
          <h2>Topics</h2>
          <ul>
            <li>
              <Link to={`${url}/contracts`}>Contracts</Link>
            </li>
          </ul>
        </Route>
        <Route path={`${path}/contracts`}>
          <ContractsPage />
        </Route>
      </Switch>
  );
};