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
					"backgroundImage": "url(./background.png)",
					"backgroundPosition": "center",
					"backgroundRepeat": "repeat",
					"backgroundSize": "cover"
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
