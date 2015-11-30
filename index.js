var fs = require('fs');
var zlib = require('zlib');

// checks whether a file exists
function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

var gunzipFile = function(source, destination, callback) {
	// check if source file exists
	if ( !fileExists(source) ) {
		return false;
	}

	try {
		// prepare streams
		var src = fs.createReadStream(source);
		var dest = fs.createWriteStream(destination);

		// extract the archive
		src.pipe(zlib.createGunzip()).pipe(dest);

		// callback on extract completion
		dest.on('close', function() {
			if ( typeof callback === 'function' ) {
				callback();
			}
		});
	} catch (err) {
		// either source is not readable
		// or the destination is not writable
		// or file not a gzip
	}
}

module.exports = gunzipFile;