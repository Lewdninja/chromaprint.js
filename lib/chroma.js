// Generated by CoffeeScript 2.5.1
(function() {
  var NUM_BANDS, chroma, freqToOctave, log2;

  if (this.chromaprint == null) {
    this.chromaprint = {};
  }

  NUM_BANDS = 12;

  log2 = Math.log(2);

  freqToOctave = function(freq, base = 440 / 16.0) {
    return Math.log(freq / base) / log2;
  };

  chroma = function(minFreq, maxFreq, frameSize, sampleRate, interpolate) {
    var features, freqToIndex, i, indexToFreq, indexToOctave, j, maxIndex, minIndex, notes, octave, ref, ref1;
    notes = [];
    features = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    freqToIndex = function(frq) {
      return Math.round(frameSize * frq / sampleRate);
    };
    indexToFreq = function(idx) {
      return (idx * sampleRate) / frameSize;
    };
    indexToOctave = function(i) {
      return freqToOctave(indexToFreq(i));
    };
    minIndex = Math.max(1, freqToIndex(minFreq));
    maxIndex = Math.min(frameSize / 2, freqToIndex(maxFreq));
    for (i = j = ref = minIndex, ref1 = maxIndex; (ref <= ref1 ? j < ref1 : j > ref1); i = ref <= ref1 ? ++j : --j) {
      octave = indexToOctave(i);
      notes[i] = NUM_BANDS * (octave - Math.floor(octave));
    }
    return function(frame) {
      var a, e, energy, fraction, k, note, ref2, ref3, unit, unit2;
      energy = function(i) {
        var ref2;
        return (ref2 = frame[i]) != null ? ref2 : 0; // null/false/undefined entries are 0
      };
      for (i = k = ref2 = minIndex, ref3 = maxIndex; (ref2 <= ref3 ? k < ref3 : k > ref3); i = ref2 <= ref3 ? ++k : --k) {
        e = energy(i);
        note = notes[i];
        unit = Math.floor(note);
        fraction = note - unit;
        if (interpolate) {
          // we apply the fractional note to the neighbouring feature
          if (fraction < 0.5) {
            unit2 = (unit + NUM_BANDS - 1) % NUM_BANDS;
            a = 0.5 + fraction;
          } else if (fraction > 0.5) {
            unit2 = (unit + 1) % NUM_BANDS;
            a = 1.5 - fraction;
          } else {
            unit2 = unit;
            a = 1.0;
          }
          features[unit] += e * a;
          features[unit2] += e * (1 - a);
        } else {
          features[unit] += e;
        }
      }
      return features;
    };
  };

  this.chromaprint.chroma = chroma;

}).call(this);