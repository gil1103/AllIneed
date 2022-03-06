import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId =
	'440013141164-4eabhs03ub0jh9bbj1l1po9fppp448mt.apps.googleusercontent.com';

export const logout = () => {
  const onSuccess=()=>{
    console.log("Log out successfull!");
  }
  
	return (
		<div id="signOutButton">
			<GoogleLogout
				clientId={clientId}
				buttonText="Logout"
				onLogoutSuccess={onSuccess}
			/>
		</div>
	);
};
