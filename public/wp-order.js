function sendToWhatsApp(cart, total, name, phone = "994501234567") {
    let text = "Salam, SteamBazari saytından sifariş vermək istəyirəm.\n\nSəbətim:\n";
    cart.forEach(item => text += `• ${item.name} — ${item.price} AZN\n`);
    text += `\nCəmi: ${total} AZN\nSifariş verən: ${name}`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

document.getElementById('order-btn')?.addEventListener('click', () => {
    const cart = [{ name: "Crimson Desert", price: "6,99" }];
    sendToWhatsApp(cart, "7,99", "elcan", "99455XXXXXX"); // nömrənizi yazın
});