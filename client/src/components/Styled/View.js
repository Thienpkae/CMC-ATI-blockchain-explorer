/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		fullwidth: {
			width: '100%',
			minHeight: 'calc(100vh - 80px)',
			paddingTop: 0,
			backgroundColor: dark ? 'rgb(36, 32, 54)' : '#FFFFFF'
		},
		display: {
			display: 'block',
			marginLeft: 'auto',
			marginRight: 'auto',
			width: '100%',
			maxWidth: 1400,
			paddingLeft: 0,
			paddingRight: 0,
			boxSizing: 'border-box',
			backgroundColor: dark ? 'transparent' : undefined
		},
		card: {
			color: dark ? '#ffffff' : undefined,
			backgroundColor: 'transparent',
			boxShadow: 'none',
			borderRadius: 0,
			border: 'none'
		}
	};
};

export const View = ({ children, classes }) => (
	<div className={classes.fullwidth}>
		<div className={classes.display}>
			<Card className={classes.card}>
				{children}
			</Card>
		</div>
	</div>
);

export default withStyles(styles)(View);
