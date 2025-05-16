document.getElementById('whatsappForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Предотвращаем отправку формы

    // Получаем данные из формы
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Формируем текст сообщения
    const whatsappMessage = `Имя: ${name}%0AТелефон: ${phone}%0AСообщение: ${message}`;

    // Номер телефона WhatsApp (замените на ваш)
    const phoneNumber = "420604173506"; // Без пробелов и знака +

    // Создаём ссылку WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

    // Открываем WhatsApp в новой вкладке
    window.open(whatsappLink, '_blank');
});