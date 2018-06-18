# X2 Framework for Node.js | Common Utilities

This is a common utilities module for the X2 Framework for Node.js. The module is included by other modules that comprise the farmework but can also be used by the application as well.

See module's [API Reference Documentation](https://boylesoftware.github.io/x2node-api-reference/module-x2node-common.html).

## Table of Contents

* [Errors](#errors)
* [Logging](#logging)
* [Actors](#actors)

## Errors

The framework modules, when encounter an unrecoverable error, often throw an `Error` object. The framework uses the following three error classes that are exported by the common module:

* `X2UsageError` - This is the error most commonly thrown by the framework components when they are not correctly invoked by the application. Examples include invalid function arguments, inappropriate function calls and all other kinds of incorrect use of the framework. Normally, this is a fatal error and it needs not to be catched, because getting this error means a bug in the application that needs to be fixed.

* `X2DataError` - This error is used to indicate that invalid, unexpected data was provided to the framework by an external component. For example, this could indicate that unexpected data cames from the database in response to a otherwise correct query. Normally, to fix the error condition something needs to be done in the external data source rather than the application code. Therefore, the application may consider this type of error as non-fatal and continue operation, while having the error logged and brought up to the maintenance attention.

* `X2SyntaxError` - This error is similar to the `X2DataError`, but has more specific "flavor". It indicates that something provided to the application from the outside has invalid syntax. Treatment of this error by the application depends on what exactly and under what circumstances throws it.

Normally, the application does create instances of these error, but it may catch and analyze one, for example like this:

```javascript
const common = require('x2node-common');

...

try {

    // call some framework stuff
    ...

} catch (err) {
    if (err instanceof common.X2SyntaxError) {
        // do something
        ...
    } else {
        throw err;
    }
}

...
```

## Logging

The framework modules use simple console-based logging provided by the common module. There are two type of logging provided: debug logging, which can be selectively turned on and off, and error logging. The application use the logging provided by the common module as well. The module exports two functions:

* `getDebugLogger(section)` - Gets a debug log function for the specified by the string argument application section. Similarly to the _Node.js_ internally logging, the function checks if `NODE_DEBUG` environment variable contains the specified section (the `NODE_DEBUG` variable is a space-separated list of section names) and if so, returns a function that takes a debug message and outputs it to the process standard error stream. If section is not listed in the `NODE_DEBUG` variable, the returned function does nothing. See specific module documentation for the section names used by the module.

* `error(msg, [err])` - Unconditionally outputs the error message to the process standard error stream. Besides the message, can be optionally provided with an `Error` object.

A custom application could use these logging facilities like the following:

```javascript
const common = require('x2node-common');

const log = common.getDebugLogger('MYAPP');

try {
    log('starting dangerous operation');

    ...

} catch (err) {
    common.error('serious error', err);
}
```

The returned debug logger function also has a Boolean property `enabled`, which tells if the debug logger is enabled or is a noop. For example, it can be used like the following:

```javascript
const log = common.getDebugLogger('MYAPP');

if (log.enabled)
    log(`a message ${that} is very ${expensive} to ${build}`);
```

By default, the log ouput includes the timestamp, the PID, the section (or "ERROR" for the error) and the message itself. An error message also includes the error stack, if provided.

The supplementary information included in the log output can be configured using `X2_LOG` environment variable, which is a comma-separated (no whitespace!) list of options. Each option can be:

* _nots_ - Do no include the message timestamp.
* _nopid_ - Do not include the process PID.
* _nosec_ - Do not include the debug log section. Does not affect error messages, which always include "ERROR" in the place of the section.
* _env:VARIABLE_ - Include value of the `VARIABLE` environment variable.

## Actors

Throughout the framework's modules the notion of _actor_ is used, which is the entity that performs an operation (makes a web-service API call, runs a database query, etc.). In the most cases the actor is what often call _user_ or _principal_ in many other systems. X2 Framework does not use the term _user_ because the entity that performs operations is not necessarily a person (it can be a script, or the system itself).

For the modules, the actor is represented by an object, that exposes the following properties and methods:

* `stamp` - Actor stamp, which is a string or a number that identifies the actor in various historical records, such as logs, record modification histories, etc. It can be, for example, a user login name or a user account id.

* `id` - The shotest possible unique identification of the actor, such as the user id, for example. Can be either a number or a string.

* `hasRole(role)` - Tells if the actor has the specified role.

Applications normally add more application-specific properties and methods to the actor objects, but the framework modules expect at least the above.
