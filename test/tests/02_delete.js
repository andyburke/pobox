const assert = require( 'assert' );
const got = require( 'got' );
const Pobox = require( '../../index.js' );

module.exports = ( plaintest ) => {
	plaintest.test( 'should allow read', async () => {
		const pobox = Pobox();
		await pobox.listen( 9111 );

		try {
			const store_response = await got( {
				url: 'http://localhost:9111/test_delete',
				method: 'POST',
				json: {
					test_delete: true
				}
			} );

			assert.strictEqual( store_response.statusCode, 200 );

			const delete_response = await got( {
				url: 'http://localhost:9111/test_delete',
				method: 'DELETE',
				responseType: 'json'
			} );

			assert.strictEqual( delete_response.statusCode, 200 );

			const body = delete_response.body;

			assert.strictEqual( body?.deleted, true );
		}
		catch( error ) {
			assert.fail( error?.response?.body ? JSON.stringify( error.response.body, null, 4 ) : error.toString() );
		}
		finally {
			await pobox.close();
		}
	} );
};