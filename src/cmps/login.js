import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId =
	'440013141164-4eabhs03ub0jh9bbj1l1po9fppp448mt.apps.googleusercontent.com';
// {
//     "client_id":"440013141164-4eabhs03ub0jh9bbj1l1po9fppp448mt.apps.googleusercontent.com",
//     "project_id":"inductive-choir-343214",
//     "auth_uri":"https://accounts.google.com/o/oauth2/auth",
//     "token_uri":"https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
//     "client_secret":"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",
//     "redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]
//     }

export const login = () => {
	const onSuccess = (res) => {
		console.log('Login success! Current user:', res.profileObj);
	};

	const onFailure = (res) => {
		console.log('Login failed! res:', res);
	};

	return (
		<div id="signInButton">
			<GoogleLogin
				clientId={clientId}
				buttonText="Login"
				onSuccess={onSuccess}
				onFailure={onFailure}
				cookiePolicy={'single_host_origin'}
				isSignedIn={true}
			/>
		</div>
	);
};
