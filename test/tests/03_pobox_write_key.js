const assert = require( 'assert' );
const got = require( 'got' );
const Pobox = require( '../../index.js' );

module.exports = ( plaintest ) => {
	plaintest.test( 'should respect POBOX_WRITE_KEY', async () => {
		process.env.POBOX_WRITE_KEY = 'test';
		const pobox = Pobox();
		await pobox.listen( 9111 );

		try {
			await got( {
				url: 'http://localhost:9111/test_write_key',
				method: 'POST',
				json: {}
			} );

			assert.fail( 'allowed write without write key' );
		}
		catch( error ) {
			assert.strictEqual( error?.response?.statusCode, 401 );
		}

		try {
			const response = await got( {
				url: 'http://localhost:9111/test_write_key',
				method: 'POST',
				json: {},
				headers: {
					'x-pobox-write-key': 'test'
				}
			} );

			assert.strictEqual( response.statusCode, 200 );
		}
		catch( error ) {
			assert.fail( error?.response?.body ? JSON.stringify( error.response.body, null, 4 ) : error.toString() );
		}
		finally {
			await pobox.close();
			delete process.env.POBOX_WRITE_KEY;
		}
	} );
};