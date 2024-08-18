exports.handler = async function(event, context) {
    const zipcode = event.queryStringParameters.zipcode;
    
    if (!zipcode) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Zipcode parameter is required" })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Received zipcode: ${zipcode}` })
    };
};
