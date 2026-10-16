function sendOrderMessage(cartItems, total, customerName) {
    let message = `Salam, SteamBazari saytından sifariş vermək istəyirəm.\n\nSəbətim:\n`;
    
    cartItems.forEach(item => {
        message += `* ${item.name} - ${item.price} AZN\n`;
    });
    
    message += `\nCəmi: ${total} AZN\nSifariş verən: ${customerName}`;
    
    return message;
}

const cart = [
    { name: "Crimson Desert", price: "6,99" }
];

const message = sendOrderMessage(cart, "7,99", "elcan");
console.log(message);