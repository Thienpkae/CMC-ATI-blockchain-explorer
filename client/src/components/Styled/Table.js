/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import classnames from 'classnames';
import NetworkPagination from './NetworkPagination';

// Suppress componentWillUpdate warning from react-table (third-party library)
// This warning comes from react-table v6 which uses deprecated lifecycle methods
// The warning is safe to suppress as it doesn't affect functionality
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
	const suppressedWarnings = [
		'componentWillUpdate',
		'componentWillReceiveProps',
		'componentWillMount'
	];

	const shouldSuppress = (message) => {
		if (typeof message !== 'string') return false;
		return (
			suppressedWarnings.some(warning => message.includes(warning)) &&
			(message.includes('react-unsafe-component-lifecycles') ||
				message.includes('Please update the following components') ||
				message.includes('has been renamed'))
		);
	};

	// Suppress console.warn (React uses warn for lifecycle warnings)
	if (!console.warn._suppressed) {
		const originalWarn = console.warn;
		console.warn = (...args) => {
			if (shouldSuppress(args[0])) {
				return;
			}
			originalWarn.apply(console, args);
		};
		console.warn._suppressed = true;
	}

	// Suppress console.error (some warnings may use error)
	if (!console.error._suppressed) {
		const originalError = console.error;
		console.error = (...args) => {
			if (shouldSuppress(args[0])) {
				return;
			}
			originalError.apply(console, args);
		};
		console.error._suppressed = true;
	}
}

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';

	const monoStack = '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';
	const bodyStack = '"Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif';

	const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#EEEEEE'; // Gray/200
	const cellDivider = dark ? 'rgba(255,255,255,0.04)' : '#EEEEEE';

	return {
		// Style chung cho bảng mạng (network-table) – đẹp, hiện đại
		table: {
			'& .rt-td': {
				textAlign: 'left',
			},

			// Class đặc biệt: .network-table – dùng cho các bảng chính
			'&.network-table': {
				fontFamily: bodyStack,
				color: dark ? '#E0E7FF' : '#212121',
				borderRadius: 8,
				border: `1px solid ${borderColor}`,
				backgroundColor: dark ? '#1b182b' : '#ffffff',
				overflow: 'hidden',
				boxShadow: 'none',

				// Header nền sáng giống Figma + border dưới
				'& .rt-thead.-header': {
					backgroundColor: dark ? '#231f38' : '#FFFFFF',
					boxShadow: 'none',
					borderBottom: `1px solid ${borderColor}`,
				},

				// Ô header + cell
				'& .rt-th, & .rt-td': {
					padding: '16px 24px !important',
					borderRight: 'none',
					borderBottom: 'none !important',
				},
				'& .rt-th:last-child, & .rt-td:last-child': {
					borderRight: 'none',
				},

				// HEADER: Đậm + JetBrains Mono
				'& .rt-th': {
					fontFamily: monoStack,
					fontSize: '14px !important',
					fontWeight: '500 !important', // In đậm rõ ràng
					lineHeight: '20px !important',
					color: dark ? '#F5F5F5' : '#212121 !important',
					textAlign: 'left',
					textTransform: 'none',
					letterSpacing: 'normal',
					backgroundColor: 'transparent !important',
				},

				// CELL: Segoe UI thường
				'& .rt-td': {
					fontFamily: bodyStack,
					fontSize: '14px',
					fontWeight: 400,
					lineHeight: '20px',
					color: dark ? '#E5E7EB' : '#212121',
					backgroundColor: 'transparent',
					// Text truncation with ellipsis for long content
					'& > div': {
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap'
					}
				},

				// Đường kẻ hàng mỏng màu Gray/200
				'& .rt-tr-group': {
					borderBottom: `1px solid ${borderColor}`,
				},

				// Nền các dòng: Figma dùng hai tone rất gần nhau
				// odd: trắng, even: xám rất nhạt (#FAFAFA)
				'& .rt-tr-group:nth-of-type(odd) .rt-td': {
					backgroundColor: dark ? 'transparent' : '#FFFFFF',
				},
				'& .rt-tr-group:nth-of-type(even) .rt-td': {
					backgroundColor: dark ? 'transparent' : '#FAFAFA',
				},

				// Pagination custom theo Figma
				'& .network-pagination': {
					borderTop: `1px solid ${borderColor}`,
					backgroundColor: dark ? '#1b182b' : '#FFFFFF',
					padding: '16px 24px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 16,
					flexWrap: 'wrap',
				},
				'& .network-pagination__summary': {
					fontFamily: bodyStack,
					fontSize: 14,
					fontWeight: 400,
					lineHeight: '20px',
					color: dark ? '#C7D2FE' : '#4B5563',
				},
				'& .network-pagination__actions': {
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: 8,
				},
				'& .network-pagination__btn': {
					height: 36,
					minWidth: 44,
					padding: '8px 12px',
					borderRadius: 4,
					border: `1px solid ${cellDivider}`,
					backgroundColor: 'transparent',
					fontFamily: bodyStack,
					fontSize: 14,
					fontWeight: 600,
					color: dark ? '#E5E7EB' : '#374151',
					cursor: 'pointer',
					transition: 'all 0.2s ease',
					display: 'flex',
					alignItems: 'center',
					gap: 6,
				},
				'& .network-pagination__btn:disabled': {
					opacity: 0.4,
					cursor: 'not-allowed',
				},
				'& .network-pagination__status': {
					minWidth: 60,
					height: 36,
					padding: '8px 16px',
					borderRadius: 4,
					border: `1px solid ${cellDivider}`,
					backgroundColor: dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
					fontFamily: bodyStack,
					fontSize: 14,
					fontWeight: 600,
					color: dark ? '#F3F4F6' : '#111827',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				},
				'& .network-pagination__icon': {
					fontFamily: bodyStack,
					fontSize: 16,
					color: dark ? '#E5E7EB' : '#9CA3AF',
				},
			},
		},

		// Nếu dùng kiểu list cũ (có scrollbar dọc)
		list: {
			'&::-webkit-scrollbar': { width: 10 },
			'&::-webkit-scrollbar-track': { background: dark ? '#443e68' : '#f1f1f1' },
			'&::-webkit-scrollbar-thumb': {
				background: dark ? '#6a5e9e' : '#c0c0c0',
				borderRadius: 5,
				'&:hover': { background: dark ? '#39c9f5' : '#a0a0a0' }
			},
		},
	};
};

const Table = ({ classes, className = '', list = false, PaginationComponent, ...rest }) => {
	const isNetworkTable = !list && className.includes('network-table');
	const tableClass = classnames(
		classes.table,
		'-striped -highlight',
		className,
		list && classes.list
	);

	const effectivePagination =
		PaginationComponent || (isNetworkTable ? NetworkPagination : undefined);
	const paginationClassName = !isNetworkTable ? classes.pagination : '';
	const paginationProps =
		effectivePagination !== undefined ? { PaginationComponent: effectivePagination } : {};

	const getPaginationProps = () =>
		paginationClassName ? { className: paginationClassName } : {};

	return (
		<ReactTable
			className={tableClass}
			{...rest}
			{...paginationProps}
			getPaginationProps={getPaginationProps}
		/>
	);
};

export default withStyles(styles)(Table);