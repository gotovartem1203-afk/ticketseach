// --- БЛОК ДАННЫХ ---
const popularCities = [
    "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", 
    "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону", 
    "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград", "Тюмень", 
    "Саратов", "Тольятти", "Ижевск", "Барнаул", "Ульяновск", "Иркутск", 
    "Хабаровск", "Махачкала", "Оренбург", "Томск", "Кемерово", "Астрахань",
    "Сочи", "Адлер", "Анапа", "Новороссийск", "Туапсе", "Геленджик", 
    "Краснодар", "Ставрополь", "Кисловодск", "Пятигорск", "Ессентуки", 
    "Минеральные Воды", "Севастополь", "Симферополь", "Феодосия", "Евпатория",
    "Мурманск", "Архангельск", "Петрозаводск", "Вологда", "Череповец", 
    "Псков", "Великий Новгород", "Калининград", "Сыктывкар", "Воркута",
    "Владивосток", "Улан-Удэ", "Чита", "Благовещенск", "Южно-Сахалинск", 
    "Сургут", "Нижневартовск", "Ханты-Мансийск", "Магнитогорск", "Нижний Тагил", 
    "Курган", "Абакан", "Братск", "Находка", "Уссурийск",
    "Ярославль", "Рязань", "Липецк", "Тула", "Курск", "Брянск", "Орел", 
    "Тамбов", "Кострома", "Иваново", "Владимир", "Смоленск", "Калуга", 
    "Пенза", "Саранск", "Киров", "Чебоксары", "Йошкар-Ола", "Белгород",
    "Бологое", "Лиски", "Ртищево", "Грязи", "Барабинск", "Тайшет"
];

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function setupSuggestions(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input || !container) return;

    input.addEventListener('input', () => {
        const val = input.value.trim().toLowerCase();
        container.innerHTML = '';
        if (val.length < 1) { container.style.display = 'none'; return; }

        const filtered = popularCities.filter(city => 
            city.toLowerCase().includes(val)
        ).slice(0, 6);

        if (filtered.length > 0) {
            filtered.forEach(city => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = city;
                item.onclick = () => {
                    input.value = city;
                    container.style.display = 'none';
                };
                container.appendChild(item);
            });
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target !== input) container.style.display = 'none';
    });
}

// ОБНОВЛЕННАЯ ФУНКЦИЯ: Без анимации и задержки
function saveAndRedirect() {
    const fromInput = document.getElementById('fromCity');
    const toInput = document.getElementById('toCity');
    const dateInput = document.getElementById('travelDate');

    const fromValue = fromInput.value.trim();
    const toValue = toInput.value.trim();
    const dateValue = dateInput.value;

    [fromInput, toInput, dateInput].forEach(el => el.style.borderColor = "");

    if (!fromValue || !toValue || !dateValue) {
        alert("Пожалуйста, заполните все поля.");
        if (!fromValue) fromInput.style.borderColor = "red";
        if (!toValue) toInput.style.borderColor = "red";
        if (!dateValue) dateInput.style.borderColor = "red";
        return;
    }

    if (fromValue.toLowerCase() === toValue.toLowerCase()) {
        alert("Город отправления и прибытия не могут совпадать.");
        return;
    }

    // Сохранение данных
    localStorage.setItem('searchFrom', fromValue);
    localStorage.setItem('searchTo', toValue);
    localStorage.setItem('searchDate', dateValue);

    // Мгновенный переход
    window.location.href = "seacrh.html";
}

// --- ОСНОВНОЙ ОБРАБОТЧИК DOM ---
document.addEventListener('DOMContentLoaded', function() {
    
    setupSuggestions('fromCity', 'from-suggestions');
    setupSuggestions('toCity', 'to-suggestions');

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    const travelDate = document.getElementById('travelDate');
    if (travelDate) {
        travelDate.min = new Date().toISOString().split("T")[0];
    }

    const popularButtons = document.querySelectorAll('.select-popular');
    popularButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const fromCity = button.getAttribute('data-from');
            const toCity = button.getAttribute('data-to');
            const today = new Date().toISOString().split('T')[0];

            const fromInput = document.getElementById('fromCity');
            const toInput = document.getElementById('toCity');
            const dateInput = document.getElementById('travelDate');

            if (fromInput && toInput && dateInput) {
                fromInput.value = fromCity;
                toInput.value = toCity;
                dateInput.value = today;
                saveAndRedirect();
            }
        });
    });
});