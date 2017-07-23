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

          fs.unlinkSync(gzPath);
          fs.unlinkSync(filePath);

          t.end();

        });

      });

    });
  });
});

tape('return errors: source file does not exist', function(t) {
  gunzip('invalid/path/file.gz', '/tmp/output-file.txt', function(err) {
    t.same(err, 'Source file does not exist! invalid/path/file.gz');
    t.end();
  });
});

tape('return errors: source file is an invalid gzip', function(t) {
  var sourceFile = __filename + '.gz';
  var destFile = __filename + '.txt'
  fs.writeFileSync(sourceFile, 'Invalid gzip content.');

  gunzip(sourceFile, destFile, function(err) {
    t.same(err.toString(), 'Error: incorrect header check');
    fs.unlinkSync(sourceFile);
    fs.unlinkSync(destFile);
    t.end();
  });
});
