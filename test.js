var tape = require('tape');
var zlib = require('zlib');
var fs = require('fs');
var gunzip = require('./');

tape('gunzip a file', function(t) {
	var gzPath = __filename + '.gz';
	var filePath = __filename.replace(/\.js$/, '-example\.js');
	var gz = fs.createWriteStream(gzPath);

	fs.createReadStream(__filename)
		.pipe(zlib.createGzip())
		.pipe(gz);

	gz.on('close', function() {
		gunzip(gzPath, filePath, function() {

			var expected = fs.createReadStream(__filename);
			expected.on('open', function() {

				var actual = fs.createReadStream(filePath);
				actual.on('open', function() {

					t.same( actual.toString(), expected.toString() );

					expected.close();
					actual.close();

					fs.unlink(gzPath);
					fs.unlink(filePath);

					t.end();
					
				});

			});
			
		});
	});
});