const { docClient, GetCommand, ScanCommand, createResponse } = require("/opt/nodejs/utils"); // Import from Layer

const tableName = process.env.tableName || "mytestCoffeeTable";

const getCoffee = async (event) => {
    const { pathParameters } = event;
    const { id } = pathParameters || {};

    try {
        let command;
        if (id) {
            command = new GetCommand({
                TableName: tableName,
                Key: {
                    "coffeeId": id,
                },
            });
        }
        else {
            command = new ScanCommand({
                TableName: tableName,
            });
        }
        const response = await docClient.send(command);
        return createResponse(200, response);
    }
    catch (err) {
        console.error("Error fetching data from DynamoDB:", err);
        return createResponse(500, { error: err.message });
    }

}

module.exports = { getCoffee };