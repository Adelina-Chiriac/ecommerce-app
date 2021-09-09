const layout = require("../layout");

module.exports = ({ items }) => {
    const renderedProducts = items.map((item) => {
        return `
            <div>${item.product.title} - $${item.product.price} | Quantity: ${item.quantity}</div>
        `;
    }).join("");

    return layout({
        content: `
            <h1>Cart</h1>
            ${renderedProducts}
        `
    });
};