const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import

const config = {
    region: "us-east-1",
};

const client = new DynamoDBClient(config);

const getCoffee = async (event) => {

    const coffeeId = "myCoff101";

    const input = {
        TableName: "mytestCoffeeTable",
        Key: {
            coffeeId: {
                S: coffeeId,
            },
        },
    };

    const command = new GetItemCommand(input);
    const response = await client.send(command);

    console.log(response);
    return response;
}

module.exports = { getCoffee };