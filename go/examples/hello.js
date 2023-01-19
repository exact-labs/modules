// import go, { setup } from 'https://r.justjs.dev/go';

import Go from '../index.js';

const go = await new Go({ verbose: false });

console.log('run');
go.eval('hello.go');
