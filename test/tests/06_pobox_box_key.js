const assert = require( 'assert' );
const got = require( 'got' );
const Pobox = require( '../../index.js' );

module.exports = ( plaintest ) => {
	plaintest.test( 'should respect box key', async () => {
		const pobox = Pobox();
		await pobox.listen( 9111 );

		try {
			await got( {
				url: 'http://localhost:9111/test/box/key',
				method: 'POST',
				headers: {
					'x-pobox-box-key': 'test'
				},
				json: {
					test_box_key: true
				}
			} );

			try {
				await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'GET'
				} );

				assert.fail( 'allowed get without box key' );
			}
			catch( error ) {
				assert.strictEqual( error?.response?.statusCode, 401 );
			}

			try {
				await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'DELETE'
				} );

				assert.fail( 'allowed delete without box key' );
			}
			catch( error ) {
				assert.strictEqual( error?.response?.statusCode, 401 );
			}

			try {
				await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'POST',
					json: {
						test_box_key_without_box_key: true
					}
				} );

				assert.fail( 'allowed post without box key' );
			}
			catch( error ) {
				assert.strictEqual( error?.response?.statusCode, 401 );
			}

			try {
				const response = await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'GET',
					headers: {
						'x-pobox-box-key': 'test'
					},
					responseType: 'json'
				} );

				assert.strictEqual( response.body.test_box_key, true );
				assert.notStrictEqual( response.body.test_box_key_without_box_key, true );
			}
			catch( error ) {
				throw typeof error?.response?.body === 'object' ? new Error( JSON.stringify( error.response.body, null, 4 ) ) : error;
			}

			try {
				await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'POST',
					headers: {
						'x-pobox-box-key': 'test'
					},
					json: {
						updated: true
					},
					responseType: 'json'
				} );
			}
			catch( error ) {
				throw typeof error?.response?.body === 'object' ? new Error( JSON.stringify( error.response.body, null, 4 ) ) : error;
			}

			try {
				const response = await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'GET',
					headers: {
						'x-pobox-box-key': 'test'
					},
					responseType: 'json'
				} );

				assert.strictEqual( response.body.updated, true );
				assert.notStrictEqual( response.body.test_box_key, true );
				assert.notStrictEqual( response.body.test_box_key_without_box_key, true );
			}
			catch( error ) {
				throw typeof error?.response?.body === 'object' ? new Error( JSON.stringify( error.response.body, null, 4 ) ) : error;
			}

			try {
				const response = await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'DELETE',
					headers: {
						'x-pobox-box-key': 'test'
					},
					responseType: 'json'
				} );

				assert.strictEqual( response.body.deleted, true );
			}
			catch( error ) {
				throw typeof error?.response?.body === 'object' ? new Error( JSON.stringify( error.response.body, null, 4 ) ) : error;
			}

			try {
				await got( {
					url: 'http://localhost:9111/test/box/key',
					method: 'GET',
					headers: {
						'x-pobox-box-key': 'test'
					},
					responseType: 'json'
				} );

				assert.fail( 'got deleted box with box key' );
			}
			catch( error ) {
				assert.strictEqual( error?.response?.statusCode, 404 );
			}
		}
		catch( error ) {
			throw typeof error?.response?.body === 'object' ? new Error( JSON.stringify( error.response.body, null, 4 ) ) : error;
		}
		finally {
			await pobox.close();
		}
	} );
};