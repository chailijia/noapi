
const noapi = require('..');

const name = 'myApi'; // the default value is "default"
const port = 3001; // the default value is 3000
const isSilence = true; // the default value is false

// The order of the parameters can be arbitrary
noapi(name, port, isSilence);
