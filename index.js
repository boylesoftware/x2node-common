/**
 * Common utilities module.
 *
 * @module x2node-common
 */
'use strict';


/////////////////////////////////////////////////////////////////////////////////
// Externals.
/////////////////////////////////////////////////////////////////////////////////

/**
 * Node.js <code>Error</code> object.
 *
 * @external Error
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/errors.html#errors_class_error}
 */


/////////////////////////////////////////////////////////////////////////////////
// Errors
/////////////////////////////////////////////////////////////////////////////////

/**
 * General framework usage error, such as invalid arguments, inappropriate
 * function call, etc.
 *
 * @extends external:Error
 */
exports.X2UsageError = class extends Error {

	/**
	 * Create new error to throw.
	 *
	 * @param {string} message The error description.
	 */
	constructor(message) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = 'X2UsageError';
		this.message = message;
	}
}

/**
 * Provided syntax error.
 *
 * @extends external:Error
 */
exports.X2SyntaxError = class extends Error {

	/**
	 * Create new error to throw.
	 *
	 * @param {string} message The error description.
	 */
	constructor(message) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = 'X2SyntaxError';
		this.message = message;
	}
}

/**
 * Provided data error.
 *
 * @extends external:Error
 */
exports.X2DataError = class extends Error {

	/**
	 * Create new error to throw.
	 *
	 * @param {string} message The error description.
	 */
	constructor(message) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = 'X2DataError';
		this.message = message;
	}
}


/////////////////////////////////////////////////////////////////////////////////
// Logger
/////////////////////////////////////////////////////////////////////////////////

/**
 * Debug loggers.
 *
 * @private
 * @type {Object.<string,Function>}
 */
const DEBUG_LOGGERS = {};

/**
 * Get debug logger.
 *
 * @param {string} section Section being debugged.
 * @returns {Function} Debug logger function that takes one argument, which is
 * the debug message.
 */
exports.getDebugLogger = function(section) {

	let sectionUC;
	let logger = DEBUG_LOGGERS[sectionUC = section.toUpperCase()];
	if (!logger) {
		const re = new RegExp('\\b' + sectionUC + '\\b', 'i');
		logger = DEBUG_LOGGERS[sectionUC] = (
			re.test(process.env.NODE_DEBUG) ?
				function(msg) {
					console.error(
						(new Date()).toISOString() +
							' ' + process.pid +
							' ' + sectionUC +
							': ' + msg
					);
				} :
				function() {}
		);
	}

	return logger;
};

/**
 * Log application error.
 *
 * @param {string} msg Error message.
 * @param {external:Error} [err] Optional error object.
 */
exports.error = function(msg, err) {

	console.error(
		(new Date()).toISOString() + ' ' + process.pid + ': ' + msg +
			(err ? ': [' + err.name + ']: ' + err.message : '')
	);
};
