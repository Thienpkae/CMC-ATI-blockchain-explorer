/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactSelect from 'react-select';
import 'react-select/dist/react-select.css';
import classnames from 'classnames';

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		select: {
			'& .Select-control': {
				backgroundColor: dark ? '#6a628e' : '#ffffff !important',
				border: dark ? 'none' : '1px solid #e0e0e0 !important',
				borderRadius: '8px !important',
				minHeight: '32px !important',
				height: '32px !important',
				boxShadow: 'none !important',
				'&:hover': {
					borderColor: dark ? 'none' : '#e0e0e0 !important',
					boxShadow: 'none !important'
				}
			},
			'& .Select-control .Select-clear-zone': {
				display: 'none',
				width: '95% !important',
				margin: 'auto'
			},
			'& .Select-control .Select-value': {
				paddingRight: '22px !important',
				paddingLeft: '12px !important',
				lineHeight: '32px !important'
			},
			'& .Select-control .Select-value-label': {
				color: dark ? '#ffffff' : '#424242 !important',
				fontSize: '14px !important',
				fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif !important'
			},
			'& .Select-control .Select-arrow-zone .Select-arrow': {
				borderTopColor: dark ? '#ffffff' : '#424242 !important',
				opacity: 1
			},
			'& .Select-control.is-focused': {
				borderColor: dark ? 'none' : '#e0e0e0 !important',
				boxShadow: 'none !important'
			},
			'& .Select-control.is-open': {
				borderColor: dark ? 'none' : '#e0e0e0 !important',
				boxShadow: 'none !important'
			},
			'& .Select-menu-outer': {
				background: dark ? '#5a5379 !important' : '#ffffff !important',
				border: dark ? 'none' : '1px solid #e0e0e0 !important',
				borderRadius: '8px !important',
				boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1) !important',
				marginTop: '4px !important',
				zIndex: 9999
			},
			'& .Select-menu': {
				borderRadius: '8px !important'
			},
			'& .Select-option': {
				background: dark ? '#453e68 !important' : '#ffffff !important',
				color: dark ? '#cfcdcd !important' : '#424242 !important',
				padding: '8px 12px !important',
				fontSize: '14px !important',
				fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif !important',
				'&:first-child': {
					borderTopLeftRadius: '8px !important',
					borderTopRightRadius: '8px !important'
				},
				'&:last-child': {
					borderBottomLeftRadius: '8px !important',
					borderBottomRightRadius: '8px !important'
				}
			},
			'& .Select-option.is-selected': {
				background: dark ? '#6a628e !important' : '#f5f5f5 !important',
				color: dark ? '#ffffff !important' : '#424242 !important'
			},
			'& .Select-option.is-focused': {
				background: dark ? '#5d5291 !important' : '#f5f5f5 !important',
				color: dark ? '#ffffff !important' : '#424242 !important'
			},
			'& .Select-placeholder': {
				color: dark ? '#cfcdcd' : '#9e9e9e !important',
				fontSize: '14px !important',
				fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif !important',
				paddingLeft: '12px !important'
			}
		},
		filter: {
			[`
        & .Select-control,
        & .Select-menu-outer,
        & .Select-option,
        & .Select-option.is-selected,
        & .Select-option.is-focused
      `]: {
				background: dark ? '#7165ae !important' : '#ffffff !important',
				color: dark ? '#ffffff !important' : '#424242 !important'
			}
		}
	};
};

const Select = props => {
	const { className = '', classes, filter, ...rest } = props;
	const clazz = classnames(classes.select, filter && classes.filter, className);
	return <ReactSelect className={clazz} {...rest} />;
};

export default withStyles(styles)(Select);
