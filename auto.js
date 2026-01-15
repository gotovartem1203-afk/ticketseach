document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const regBtn = document.getElementById('regBtn');
    const closeBtn = document.querySelector('.close-modal');
    const authForm = document.getElementById('authForm');
    const authBlock = document.getElementById('authBlock');
    const toggleAuth = document.getElementById('toggleAuth');
    
    const nameInput = document.getElementById('authName');
    const lastNameInput = document.getElementById('authLastName');
    
    let isLogin = true;

    // Управление модальным окном
    if (loginBtn) loginBtn.onclick = () => { isLogin = true; updateModal(); modal.style.display = "block"; };
    if (regBtn) regBtn.onclick = () => { isLogin = false; updateModal(); modal.style.display = "block"; };
    if (closeBtn) closeBtn.onclick = () => { modal.style.display = "none"; };

    function updateModal() {
        const regFields = document.getElementById('regFields');
        const modalTitle = document.getElementById('modalTitle');
        const submitAuth = document.getElementById('submitAuth');

        if (modalTitle) modalTitle.innerText = isLogin ? "Вход" : "Регистрация";
        if (submitAuth) submitAuth.innerText = isLogin ? "Войти" : "Создать аккаунт";
        if (toggleAuth) toggleAuth.innerText = isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти";
        
        if (regFields) {
            regFields.style.display = isLogin ? "none" : "block";
            if (nameInput) nameInput.required = !isLogin;
            if (lastNameInput) lastNameInput.required = !isLogin;
        }
    }

    if (toggleAuth) toggleAuth.onclick = () => { isLogin = !isLogin; updateModal(); };

    // Обработка формы
    if (authForm) {
        authForm.onsubmit = async (e) => {
            e.preventDefault();
            const endpoint = isLogin ? '/login' : '/register';
            const data = {
                email: document.getElementById('authEmail').value,
                password: document.getElementById('authPassword').value
            };

            if (!isLogin) {
                data.name = nameInput.value;
                data.last_name = lastNameInput.value;
            }

            try {
                const response = await fetch(`https://fast-rkw8.onrender.com${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Сохраняем пользователя (Ключ 'user' важен для файла поиска)
                    localStorage.setItem('user', JSON.stringify(result.user));
                    renderProfile();
                    if (modal) modal.style.display = "none";
                    authForm.reset();
                } else {
                    alert(result.detail || "Ошибка");
                }
            } catch (err) {
                console.error("Ошибка сети", err);
            }
        };
    }

    // Рендер красивого профиля
    function renderProfile() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && authBlock) {
            authBlock.innerHTML = `
                <div class="user-profile-container">
                    <div class="profile-trigger" id="profileTrigger" style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: white;">
                        <span style="font-weight: 500;">${user.name} ${user.last_name || ''}</span>
                        <div class="avatar-circle" style="width: 35px; height: 35px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="color: #1a237e; font-size: 18px;"></i>
                        </div>
                        <i class="fas fa-chevron-down" style="font-size: 12px; opacity: 0.8;"></i>
                    </div>
                    
                    <div class="profile-dropdown" id="profileDropdown">
                        <div class="dropdown-header" style="padding: 15px 20px; border-bottom: 1px solid #eee;">
                            <div style="font-weight: bold; color: #333;">${user.name} ${user.last_name || ''}</div>
                            <div style="font-size: 12px; color: #777;">${user.email}</div>
                        </div>
                        <a href="people.html" class="dropdown-item">
                            <i class="fas fa-id-card"></i> Личный кабинет
                        </a>
                        <div class="dropdown-item logout-item" onclick="logout()" style="color: #e53935; cursor: pointer;">
                            <i class="fas fa-sign-out-alt"></i> Выйти
                        </div>
                    </div>
                </div>
            `;

            const trigger = document.getElementById('profileTrigger');
            const dropdown = document.getElementById('profileDropdown');

            if (trigger && dropdown) {
                trigger.onclick = (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                };

                document.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                });
            }
        }
    }

    window.logout = () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html'; 
    };

    renderProfile(); 
});