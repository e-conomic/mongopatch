var streams = helper.requireSource('streams');

var update = require('./_update.spec');
var dbupdate = require('./_db_update.spec');

describe('streams.update', function() {
	update(streams.update);
	dbupdate(streams.update);
});
