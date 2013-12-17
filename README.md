mongopatch
==========

MongoDB patching tool. Update and log mongodb documents.

	npm install -g mongopatch


Writing patches
---------------

Patches are written as separate modules, exposing a single patching function.

```javascript

module.exports = function(patch) {
	// Specify which patching system version to use for this patch (required)
	patch.version('0.1.0');

	// Update all users that match the provided query.
	// The query is optional, if not provided all the documents
	// in the collection are processed.
	patch.update('users',  { name: 'e-conomic' }, function(document, callback) {
		// The callback function should be called with the update to apply,
		// this can be any valid mongodb update query.
		callback(null, { $set: { email: 'e-conomic@e-conomic.com' } });
	});

	// Register an after callback, to be run after each update.
	patch.after(function(updatedDocument, callback) {
		var isValid = updatedDocument.email === 'e-conomic@e-conomic.com';

		// Call the callback function with an error to abort the patching process.
		// Use this to guard against corrupted updates.
		callback(isValid ? null : new Error('Update failed'));
	});
}
```

Another example where we process all users.

```javascript
function shouldUpdate(document) {
	// ...
}

function update(document) {
	// ...
}

function isValid(document) {
	// ...
}

module.exports = function(patch) {
	patch.version('0.1.0');

	// All users are processed, since no filter query provided.
	patch.update('users', function(document, callback) {
		if(!shouldUpdate(document)) {
			// Calling the callback with no arguments, skips the document in the update process.
			return callback();
		}

		update(document);

		if(!isValid(document)) {
			// Validate document before performing the actual update in the database.
			// Passing an error as first argument, aborts the patching process,
			// and can leave the database in inconsistent state.
			return callback(new Error('Invalid document'));
		}

		// Apply the update, by overwritting the whole document
		callback(null, document);
	});
}
```

Runing patches
--------------

Run patches using the `mongopatch` command-line tool. Basic usage:

	mongopatch path/to/patch.js --db databaseConnectionString --dry-run --log-db logDatabaseConnectionString

Available options

- **db**: MongoDB connection string (e.g. `user:password@localhost:27017/development` or `development`).
- **log-db**: MongoDB connection string for the log database. When provided a version of the document is stored before and after the update.
- **dry-run**: Do not perform any changes in the database. Changes are performed on copy of the documents and stored in the log db (if available).
- **parallel**: Run the patch with given parallelism. It may run the patch faster.


QA testing of patches
---------------------

Where to test patches
* Preliminary testing of patches can be done locally
* Final test of a patch should be done on:
** Staging environment
** Latest release codebase (all repos)
** Latest production DB dump

How to report results of test
* Results of test are to be reported in Jira, in corresponding item

Algorithm of testing
* Note or create test data:
** Counters of items to be patched (and to be NOT touched?)
** Samples of items to be patched (and to be NOT touched?)
* Run patch in the dry-run mode with log-db.
* Examine results in the log-db.
* Run patch in real mode.
* Examine results in the log-db and target-db:
** Are patched objects updated as required?
** Do objects that are NOT target of patch still exist and are they not corrupted? (this can be done or partially done with an .after function in patch)
* Examine results via the app GUI:
** Can patched objects be used by end-user?
** Can objects that are NOT target of patch be used by end-user?
