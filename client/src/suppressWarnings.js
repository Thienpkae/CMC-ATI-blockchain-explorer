/**
 *    SPDX-License-Identifier: Apache-2.0
 * 
 * Suppress warnings from third-party libraries:
 * - Deprecated lifecycle warnings (componentWillUpdate, etc.)
 * - Styling property conflicts (borderColor/border shorthand)
 * This file must be imported first to catch all warnings before React loads
 */

// Suppress deprecated lifecycle warnings from third-party libraries
// This must run before React and other imports to catch all warnings
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
	const suppressedWarnings = [
		'componentWillUpdate',
		'componentWillReceiveProps',
		'componentWillMount'
	];

	const shouldSuppress = (message) => {
		if (typeof message !== 'string') return false;

		// Suppress deprecated lifecycle warnings from third-party libraries
		const lifecycleWarning = suppressedWarnings.some(warning => message.includes(warning)) &&
			(message.includes('react-unsafe-component-lifecycles') ||
				message.includes('Please update the following components') ||
				message.includes('has been renamed') ||
				message.includes('Dropdown'));

		// Suppress borderColor/border shorthand property conflict from react-multi-select
		const borderColorWarning = message.includes('borderColor') &&
			message.includes('border') &&
			(message.includes('shorthand') || message.includes('conflicting'));

		return lifecycleWarning || borderColorWarning;
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

