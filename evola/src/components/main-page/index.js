import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import ContractsPage from '../contracts-page';
import NavigationBar from '../nav-bar';
import FooterControl from '../footer-control';
import NoMatchPage from '../NoMatch-Page';

const MainPage = () => {
	return (
		<Router>
			<div className="bg-cover flex flex-col min-h-screen" style={
				{
					"backgroundImage": "url(https://cdn.discordapp.com/attachments/376647838710628355/1009872730604179537/evobgtest-min.png)",
					"background-position": "center",
					"background-repeat": "repeat",
					"background-size": "cover"
				}}>
				<NavigationBar />
				<div className="flex-grow container mx-auto py-8 px-4 md:py-16 md:px-8">
					<Switch>
						<Route exact path="/">
							<ContractsPage />
						</Route>
						<Route path="*">
							<NoMatchPage />
						</Route>
					</Switch>
				</div>
				<FooterControl />
			</div>
		</Router>
	);
}

export default MainPage;