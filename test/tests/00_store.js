const assert = require( 'assert' );
const got = require( 'got' );
const Pobox = require( '../../index.js' );

module.exports = ( plaintest ) => {
	plaintest.test( 'should allow store', async () => {
		const pobox = Pobox();
		await pobox.listen( 9111 );

		try {
			const response = await got( {
				url: 'http://localhost:9111/test',
				method: 'POST',
				json: {}
			} );

			assert.strictEqual( response.statusCode, 200 );
		}
		catch( error ) {
			assert.fail( error?.response?.body ? JSON.stringify( error.response.body, null, 4 ) : error.toString() );
		}
		finally {
			await pobox.close();
		}
	} );
};