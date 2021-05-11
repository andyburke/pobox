const assert = require( 'assert' );
const got = require( 'got' );
const Pobox = require( '../../index.js' );

module.exports = ( plaintest ) => {
	plaintest.test( 'should allow read', async () => {
		const pobox = Pobox();
		await pobox.listen( 9111 );

		try {
			const store_response = await got( {
				url: 'http://localhost:9111/test_read',
				method: 'POST',
				json: {
					test_read: true
				}
			} );

			assert.strictEqual( store_response.statusCode, 200 );

			const read_response = await got( {
				url: 'http://localhost:9111/test_read',
				method: 'GET',
				responseType: 'json'
			} );

			assert.strictEqual( read_response.statusCode, 200 );

			const body = read_response.body;

			assert.strictEqual( body?.test_read, true );
		}
		catch( error ) {
			assert.fail( error?.response?.body ? JSON.stringify( error.response.body, null, 4 ) : error.toString() );
		}
		finally {
			await pobox.close();
		}
	} );
};