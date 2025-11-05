import React, { useEffect, useState } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Config from '../../services/config-service';
import ContractsPage from '../contracts-page';
import NavigationBar from '../nav-bar';
import FooterControl from '../footer-control';
import NoMatchPage from '../NoMatch-Page';



const MainPage = () => {
	const [backgroundImage, setBackgroundImage] = useState(null);
	const [notificationEnabled, setNotificationEnabled] = useState(false);
	const [notificationText, setNotificationText] = useState(null);

	useEffect(() => {
		const fetchBackground = async () => {
			try {
				const response = await fetch(`${Config.evola_api_root_url}/content-global`);
				const json = await response.json();
				const bgId = json?.data?.Background;
				const notificationBool = json?.data?.Notification;
				const notification = json?.data?.NotificationText;
				if (bgId) {
					setBackgroundImage(`${Config.evola_api_root_url}/assets/${bgId}`);
				}
				if(notificationBool) setNotificationEnabled(notificationBool);
				if(notification) setNotificationText(notification);
			} catch (error) {
				console.error('Failed to fetch background:', error);
			}
		};

		fetchBackground();
	}, []);

	const backgroundStyle = {
		backgroundImage: `
    radial-gradient(ellipse at center, rgba(50, 50, 50, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%),
    url(${backgroundImage ? backgroundImage : './background.png'})
  `,
		backgroundPosition: 'center',
		backgroundRepeat: 'repeat',
		backgroundSize: 'cover',
	};


	return (
		<Router>
			<div
				className="flex flex-col min-h-screen text-gray-300 font-sans"
				style={backgroundStyle}
			>
				{/* Navigation */}
				<NavigationBar />

				{/* Main Content */}
				<main className="flex-grow px-4 md:px-8 py-8 md:py-16 max-w-7xl mx-auto w-full">
					{/* Notification Bar */}
					{notificationEnabled && (
					<div className="mb-6 bg-gray-800 bg-opacity-80 border-l-4 border-blue-500 text-blue-300 shadow-md rounded-md px-6 py-3 flex items-center justify-between font-mono tracking-wide text-sm backdrop-blur-sm">
						<span dangerouslySetInnerHTML={{ __html: notificationText }} />
					</div>
					)}
					<Switch>
						<Route exact path="/">
							<ContractsPage />
						</Route>
						<Route path="*">
							<NoMatchPage />
						</Route>
					</Switch>
				</main>

				{/* Footer */}
				<FooterControl />
			</div>
		</Router>

	);
}

export default MainPage;
