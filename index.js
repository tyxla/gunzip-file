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
		if ( typeof callback === 'function' ) {
      callback('Source file does not exist! ' + source);
      return;
    }
	}

	try {
		// prepare streams
		var src = fs.createReadStream(source);
		var dest = fs.createWriteStream(destination);

		// extract the archive
		src
      .on('error', function(err) {
        if ( typeof callback === 'function' ) {
          callback(err);
          return;
        }
      })
      .pipe(zlib.createGunzip())
      .on('error', function(err) {
        if ( typeof callback === 'function' ) {
          callback(err);
          return;
        }
      })
      .pipe(dest)
      .on('error', function(err) {
        if ( typeof callback === 'function' ) {
          callback(err);
          return;
        }
      });

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
    if ( typeof callback === 'function' ) {
      callback(err);
    }
	}
}

module.exports = gunzipFile;
