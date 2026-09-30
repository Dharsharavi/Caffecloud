const data = {
    // name: "test",
    // price: 100,
    // available: true,
};
const { name, price, available } = data;
let updateExpression = `SET  ${name ? "#name = :name, " : ""}${price ? "price = :price, " : ""}${available ? "available = :available, " : ""}`.slice(0, -2);
console.log("updateExpression", updateExpression);
