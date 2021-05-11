'use strict';

const plaintest = require( 'plaintest' );

plaintest.headline( 'POBOX' );

const tests = require( './tests/index.js' );
for ( const test of tests ) {
	test( plaintest );
}

( async function() {
	await plaintest.run();
} )();
