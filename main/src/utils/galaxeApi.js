const {default: axios} = require('axios');

const credId = '123';
const operation = 'APPEND';

export const appendToGalaxeList = async email => {
  // Nodejs using Axios lib
  let result = await axios.post(
    'https://graphigo.prd.galaxy.eco/query',
    {
      operationName: 'credentialItems',
      query: `
    mutation credentialItems($credId: ID!, $operation: Operation!, $items: [String!]!) 
      { 
        credentialItems(input: { 
          credId: $credId 
          operation: $operation 
          items: $items 
        }) 
        { 
          name 
        } 
      }
    `,
      variables: {
        // Make sure this is string type as int might cause overflow
        credId: credId,
        operation: operation,
        items: [email],
      },
    },
    {
      headers: {
        'access-token': 'Wbp6HXqqVUpcYC9shTozsy0eTihNDejH',
      },
    },
  );
  if (result.status != 200) {
    throw new Error(result);
  } else if (result.errors && result.errors.length > 0) {
    // NOTE: GraphQL returns 200 even if there's an error,
    // so must explicitly check result.errors.
    console.log(result.errors);
    throw new Error(result.errors);
  }
};
