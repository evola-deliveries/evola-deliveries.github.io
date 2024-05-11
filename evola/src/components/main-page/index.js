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
					"backgroundImage": "url(https://media.discordapp.net/attachments/812351111427129424/1238855555926458438/Original.webp?ex=6640cda5&is=663f7c25&hm=5fbfd0dba050782a8a98309b553ba75f17aaff470a4b15c6e97e5f9991fe7656&=&format=webp&width=1440&height=603)",
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
