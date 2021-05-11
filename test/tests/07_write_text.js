const assert = require( 'assert' );
const got = require( 'got' );
const Pobox = require( '../../index.js' );

module.exports = ( plaintest ) => {
	plaintest.test( 'should allow text/plain', async () => {
		const pobox = Pobox();
		await pobox.listen( 9111 );

		try {
			const write_response = await got( {
				url: 'http://localhost:9111/test_text_plain',
				method: 'POST',
				headers: {
					'content-type': 'text/plain; charset=utf-8'
				},
				body: 'hello world'
			} );

			assert.strictEqual( write_response.statusCode, 200 );

			const read_response = await got( {
				url: 'http://localhost:9111/test_text_plain',
				method: 'GET'
			} );

			assert.strictEqual( read_response.statusCode, 200 );
			assert.strictEqual( read_response.body, 'hello world' );
		}
		catch( error ) {
			assert.fail( error?.response?.body ? JSON.stringify( error.response.body, null, 4 ) : error.toString() );
		}
		finally {
			await pobox.close();
		}
	} );
};