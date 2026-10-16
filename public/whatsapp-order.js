function sendOrderToWhatsApp(cartItems, total, customerName, phoneNumber = "994501234567") {
    let message = `Salam, SteamBazari saytından sifariş vermək istəyirəm.\n\nSəbətim:\n`;
    
    cartItems.forEach(item => {
        message += `* ${item.name} - ${item.price} AZN\n`;
    });
    
    message += `\nCəmi: ${total} AZN\nSifariş verən: ${customerName}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

document.getElementById('order-btn').addEventListener('click', () => {
    const cart = [{ name: "Crimson Desert", price: "6,99" }];
    sendOrderToWhatsApp(cart, "7,99", "elcan");
});