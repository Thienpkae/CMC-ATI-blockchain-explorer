// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from 'reactstrap';

const styles = {
	error: {
		marginTop: 50,
		marginBottom: -95,
		paddingTop: 30,
		textAlign: 'center',
		width: '100%'
	}
};

export const ErrorMessage = ({ message, classes }) => {
	let displayMessage = message;
	if (typeof message === 'object' && message !== null) {
		displayMessage = message.error || JSON.stringify(message);
	}
	return (
		<div className={classes.error}>
			<Alert color="danger">{displayMessage}</Alert>
		</div>
	);
};

export default withStyles(styles)(ErrorMessage);
