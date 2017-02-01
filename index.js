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

/**
 * ES6 <code>Promise</code> object.
 *
 * @external Promise
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}
 */
/**
 * ES6 <code>Map</code> object.
 *
 * @external Map
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 */
/**
 * ES6 <code>Symbol</code> object.
 *
 * @external Symbol
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol}
 */


/////////////////////////////////////////////////////////////////////////////////
// Errors.
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
