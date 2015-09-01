var _ = require('underscore');
var Buffer = require('buffer').Buffer;

module.exports = {
  generateRandomString: function() {
    var buffer = new Buffer(24);
    _.times(24, function(i) {
      buffer.set(i, _.random(0, 255));
    });
    return buffer.toString('base64');
  }
}
