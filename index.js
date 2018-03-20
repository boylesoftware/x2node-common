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
 * Node.js <code>EventEmitter</code> object.
 *
 * @external EventEmitter
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/events.html#events_class_eventemitter}
 */
/**
 * Node.js <code>Buffer</code> object.
 *
 * @external Buffer
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/buffer.html#buffer_class_buffer}
 */
/**
 * Node.js <code>stream.Readable</code> object.
 *
 * @external stream.Readable
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/stream.html#stream_class_stream_readable}
 */
/**
 * Node.js parsed URL object.
 *
 * @external Url
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/url.html}
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
		super(message);

		this.name = 'X2UsageError';

		Error.captureStackTrace(this, this.constructor);
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
		super(message);

		this.name = 'X2SyntaxError';

		Error.captureStackTrace(this, this.constructor);
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
		super(message);

		this.name = 'X2DataError';

		Error.captureStackTrace(this, this.constructor);
	}
}


/////////////////////////////////////////////////////////////////////////////////
// Logger
/////////////////////////////////////////////////////////////////////////////////

/**
 * Debug loggers.
 *
 * @private
 * @type {Object.<string,function>}
 */
const DEBUG_LOGGERS = {};

/**
 * Build message build functions list.
 *
 * @private
 * @param {string} [section] Debug log section, nothing if error log.
 * @returns {Array.<function>} Message builder functions.
 */
function buildMessageBuilder(section) {

	const logOptions = process.env.X2_LOG || '';

	const msgBuilder = new Array();

	if (!/(^|,)nots(,|$)/i.test(logOptions))
		msgBuilder.push(() => (new Date()).toISOString());

	if (!/(^|,)nopid(,|$)/i.test(logOptions))
		msgBuilder.push(() => String(process.pid));

	let m;
	const envRE = new RegExp('(?:^|,)env:([^,]+)', 'gi');
	while ((m = envRE.exec(logOptions)) !== null) {
		const envName = m[1];
		msgBuilder.push(() => process.env[envName]);
	}

	if (section && !/(^|,)nosec(,|$)/i.test(logOptions))
		msgBuilder.push(() => section);

	return msgBuilder;
}

/**
 * Get debug logger.
 *
 * @param {string} section Section being debugged.
 * @returns {function} Debug logger function that takes one argument, which is
 * the debug message.
 */
exports.getDebugLogger = function(section) {

	const sectionUC = section.toUpperCase();
	let logger = DEBUG_LOGGERS[sectionUC];
	if (!logger) {
		const re = new RegExp(`\\b${sectionUC}\\b`, 'i');
		if (re.test(process.env.NODE_DEBUG)) {
			const msgBuilder = buildMessageBuilder(sectionUC)
			const numParts = msgBuilder.length;
			if (numParts > 0) {
				const f = msgBuilder[numParts - 1];
				msgBuilder[numParts - 1] = () => f() + ':';
			}
			msgBuilder.push(msg => msg);
			logger = function(msg) {
				/* eslint-disable no-console */
				console.error(msgBuilder.map(p => p(msg)).join(' '));
				/* eslint-enable no-console */
			};
		} else {
			logger = function() {};
		}
		DEBUG_LOGGERS[sectionUC] = logger;
	}

	return logger;
};

/**
 * The error logger function.
 *
 * @private
 * @type {function}
 */
let errorLogger;

/**
 * Log application error.
 *
 * @param {string} msg Error message.
 * @param {external:Error} [err] Optional error object.
 */
exports.error = function(msg, err) {

	if (!errorLogger) {
		const msgBuilder = buildMessageBuilder();
		msgBuilder.push(() => 'ERROR:');
		msgBuilder.push((msg, err) => `${msg}${err ? '\n' + err.stack : ''}`);
		errorLogger = function(msg, err) {
			/* eslint-disable no-console */
			console.error(msgBuilder.map(p => p(msg, err)).join(' '));
			/* eslint-enable no-console */
		};
	}

	errorLogger(msg, err);
};
