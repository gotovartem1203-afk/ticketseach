document.addEventListener('DOMContentLoaded', function() {
    loadUserTickets();
});

async function loadUserTickets() {
    const ticketsList = document.getElementById('ticketsList');
    
    // 1. Получаем данные пользователя из localStorage (сохраненные при login)
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData || !userData.id) {
        ticketsList.innerHTML = '<div class="no-tickets"><h3>Пожалуйста, войдите в систему</h3></div>';
        return;
    }

    try {
        // 2. Запрос к вашему новому API
        const response = await fetch(`https://fast-rkw8.onrender.com/my-tickets/${userData.id}`);
        const tickets = await response.json();

        if (tickets.length === 0) {
            // Оставляем стандартную заглушку "У вас нет билетов", если массив пуст
            return;
        }

        // 3. Очищаем список и отрисовываем билеты
        ticketsList.innerHTML = ''; 

        tickets.forEach(ticket => {
            const ticketCard = document.createElement('div');
            ticketCard.className = 'ticket-card'; // Добавьте стили для этого класса в CSS
            ticketCard.style = "background: white; padding: 20px; border-radius: 10px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 5px solid #1a237e;";

            ticketCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; color: #1a237e;">${ticket.destination}</h3>
                        <p style="margin: 5px 0; color: #666;">
                            <i class="fas fa-calendar-alt"></i> ${ticket.departure_date} | 
                            <i class="fas fa-train"></i> №${ticket.train_number}
                        </p>
                        <p style="margin: 5px 0; font-size: 0.9em;">Тип вагона: <strong>${ticket.carriage_type}</strong></p>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 1.2em; font-weight: bold; color: #2c3e50;">${ticket.price} ₽</span>
                        <div style="color: green; font-size: 0.8em; margin-top: 5px;"><i class="fas fa-check-circle"></i> Оплачено</div>
                    </div>
                </div>
            `;
            ticketsList.appendChild(ticketCard);
        });

    } catch (error) {
        console.error('Ошибка загрузки билетов:', error);
        ticketsList.innerHTML = '<p>Не удалось загрузить билеты. Попробуйте позже.</p>';
    }
}