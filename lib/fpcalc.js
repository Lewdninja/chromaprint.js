// Generated by CoffeeScript 2.5.1
(function() {
  var Promise, cli, fpcalc, fs, path, print, run;

  if (!((typeof require !== "undefined" && require !== null) && (typeof module !== "undefined" && module !== null))) { // protect the browser
    return;
  }

  fs = require('fs');

  cli = require('commander');

  path = require('path');

  Promise = require('q');

  cli.description("Print the audio fingerprint of one or more files.");

  cli.usage('[options] <file ...>');

  cli.version(require('../package').version);

  cli.option('-l, --length SECS', 'seconds of audio to scan [120]', parseInt, 120);

  cli.option('-r, --raw', 'output the raw uncompressed fingerprint');

  cli.option('-a, --algo TEST', 'choose an algorithm (1-4) [2]', parseInt, 2);

  print = function(file, length, fingerprint) {
    console.log(`FILE=${file}`);
    console.log(`DURATION=${length}`);
    console.log(`FINGERPRINT=${fingerprint}`);
    return console.log("");
  };

  fpcalc = function(file, length, raw, algorithm, callback) {
    var audioBuffer, l, offset, position, read, readCallback;
    offset = 0;
    position = null;
    l = 2048;
    audioBuffer = new Buffer(l);
    readCallback = function(err, bytesRead, buffer) {
      if (err != null) {
        return callback(err);
      }
      console.log(`Read ${bytesRead} bytes => ${buffer}`);
      console.log(`  audioBuffer is now: ${buffer}`);
      console.log("  ... I think I will stop now.");
      return callback(null, audioBuffer);
    };
    read = function(err, fd) {
      if (err != null) {
        return callback(err);
      }
      return fs.read(fd, audioBuffer, offset, l, position, callback);
    };
    return fs.exists(path.resolve(file), function(ok) {
      if (ok) {
        return fs.open(file, 'r', read);
      }
      return callback(Error(`${file} - no such file `));
    });
  };

  run = function(args = process.argv) {
    var algorithm, f, length, raw;
    cli.parse(args);
    raw = !!cli.raw;
    length = cli.length || 120;
    algorithm = cli.algorithm || 2;
    if (!cli.args.length) { // exits immediately
      cli.help();
    }
    f = function(file, cb) {
      return fpcalc(file, length, raw, algorithm, cb);
    };
    return cli.args.reverse().reduce((function(p, n) {
      return function() {
        return f(n, p);
      };
    }), function() {})();
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = run;
  }

}).call(this);