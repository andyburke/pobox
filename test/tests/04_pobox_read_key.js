const assert = require( 'assert' );
const got = require( 'got' );
const Pobox = require( '../../index.js' );

module.exports = ( plaintest ) => {
	plaintest.test( 'should respect POBOX_READ_KEY', async () => {
		process.env.POBOX_READ_KEY = 'test';
		const pobox = Pobox();
		await pobox.listen( 9111 );

		try {
			await got( {
				url: 'http://localhost:9111/test_read_key',
				method: 'POST',
				json: {
					test_read_key: true
				}
			} );

			try {
				await got( {
					url: 'http://localhost:9111/test_read_key',
					method: 'GET'
				} );

				assert.fail( 'allowed reading without read key' );
			}
			catch( error ) {
				assert.strictEqual( error?.response?.statusCode, 401 );
			}
	
			const response = await got( {
				url: 'http://localhost:9111/test_read_key',
				method: 'GET',
				headers: {
					'x-pobox-read-key': 'test'
				},
				responseType: 'json'
			} );

			assert.strictEqual( response.statusCode, 200 );
			assert.strictEqual( response.body.test_read_key, true );
		}
		catch( error ) {
			assert.fail( error?.response?.body ? JSON.stringify( error.response.body, null, 4 ) : error.toString() );
		}
		finally {
			await pobox.close();
			delete process.env.POBOX_READ_KEY;
		}
	} );
};