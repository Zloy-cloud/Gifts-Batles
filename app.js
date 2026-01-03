// URL твоего backend
const API_URL = "https://warzone-hub-backend.onrender.com";

// =============================
// 1. Открытие/закрытие модалки
// =============================
const promoModal = document.getElementById("promoModal");
const btnPromo = document.getElementById("btnPromo");
const promoCancel = document.getElementById("promoCancel");
const promoApply = document.getElementById("promoApply");
const promoStatus = document.getElementById("promoStatus");

btnPromo.onclick = () => {
    promoModal.style.display = "flex";
};

promoCancel.onclick = () => {
    promoModal.style.display = "none";
    promoStatus.textContent = "";
};

// =============================
// 2. Активация промокода
// =============================
promoApply.onclick = async () => {
    const code = document.getElementById("promoInput").value.trim();
    const userId = "123"; // временно, потом сделаем авторизацию

    if (!code) {
        promoStatus.textContent = "Введите промокод!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/promo/redeem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, code })
        });

        const data = await response.json();
        promoStatus.textContent = data.message;

        // обновляем баланс, если есть reward
        if (data.success && data.reward) {
            const balanceEl = document.getElementById("balance");
            balanceEl.textContent = Number(balanceEl.textContent) + data.reward;
        }

    } catch (err) {
        promoStatus.textContent = "Ошибка соединения с сервером";
    }
};

// =============================
// 3. Переключение секций
// =============================
document.querySelectorAll(".nav-item").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const section = btn.dataset.section;

        document.querySelectorAll(".panel").forEach(panel => {
            panel.classList.remove("panel-active");
        });

        document.getElementById(`section-${section}`).classList.add("panel-active");
    };
});

