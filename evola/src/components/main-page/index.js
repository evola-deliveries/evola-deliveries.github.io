import React, { useEffect, useState } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Config from '../../services/config-service';
import ContractsPage from '../contracts-page';
import NavigationBar from '../nav-bar';
import FooterControl from '../footer-control';
import NoMatchPage from '../NoMatch-Page';



const MainPage = () => {
	const [backgroundImage, setBackgroundImage] = useState(null);

	useEffect(() => {
		const fetchBackground = async () => {
			try {
				const response = await fetch(`${Config.evola_api_root_url}/content-global`);
				const json = await response.json();
				const bgId = json?.data?.Background;

				if (bgId) {
					setBackgroundImage(`${Config.evola_api_root_url}/assets/${bgId}`);
				}
			} catch (error) {
				console.error('Failed to fetch background:', error);
			}
		};

		fetchBackground();
	}, []);

	const backgroundStyle = {
		backgroundImage: backgroundImage
			? `url(${backgroundImage})`
			: 'url(./background.png)',
		backgroundPosition: 'center',
		backgroundRepeat: 'repeat',
		backgroundSize: 'cover',
	};

	return (
		<Router>
			<div className="bg-cover flex flex-col min-h-screen" style={backgroundStyle}>
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
