
// experimental function that adds supports for lines using streams
// only works if the stream is encoded with either 'ascii' or 'utf8'
// adds a writeln function which is a shorthand for write(str + "\n")
// adds a 'line' event to readable streams which buffers any data
// until it encounters EOL
var _stream_writeln = function writeln(str) {
  this.write(str + '\n');
};
// this function is called when a listener for 'line' has been added
// to the stream. it is not nested in the setup function to prevent
// any unnecessary closured data
function _setupLines(stream) {
  this.writeln = _stream_writeln;
  // we buffer incoming data until a full line is buffered
  // then the line event is emitted with the content of the
  // line (without the newline character)
  var line_buffer = '';
  stream.on('data', function(data) {
    if(typeof(data) != 'string') {
      line_buffer = '';
      return;
    }
    var split = data.split(/\n\r|\n|\r/);
    // if the chunk contains more than one line
    // we make sure that all the lines are emitted in the right order
    // and that the end of the chunk is buffered
    var end = split.pop();
    while(split.length) {
      line_buffer += split.shift();
      this.emit('line', line_buffer);
      line_buffer = '';
    }
    line_buffer += end;
  });
  function endlistener () {
    // when the stream reaches its end, emit the last bit of buffered data
    // FIXME: find a way to make sure that these data are emitted
    // before any other 'end' listeners are called
    if(line_buffer != '') this.emit('line', line_buffer);
  }
  stream.on('end', endlistener);
}

module.exports = function lines(stream) {
  // we can start consuming incoming data when at least
  // one listener is set. note that 'data' can still be listened to.
  // however, if lines() is called after data have started being consumed
  // the first lines of the message will be missing.
  stream.on('newListener', function(type, listener) {
    if(type === 'line') {
      _setupLines(this);
    }
  });
  stream.writeln = _stream_writeln;
};


