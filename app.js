// ===== Переключение секций =====
const navButtons = document.querySelectorAll(".nav-item");
const panels = {
    chat: document.getElementById("section-chat"),
    drops: document.getElementById("section-drops"),
    shop: document.getElementById("section-shop"),
    market: document.getElementById("section-market"),
};

navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-section");

        navButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        Object.entries(panels).forEach(([key, panel]) => {
            panel.classList.toggle("panel-active", key === target);
        });
    });
});

// ===== Промокод модалка =====
const promoModal = document.getElementById("promoModal");
const btnPromo = document.getElementById("btnPromo");
const promoCancel = document.getElementById("promoCancel");
const promoApply = document.getElementById("promoApply");
const promoInput = document.getElementById("promoInput");
const promoStatus = document.getElementById("promoStatus");

btnPromo.addEventListener("click", () => {
    promoModal.classList.add("active");
    promoInput.value = "";
    promoStatus.textContent = "";
    promoStatus.className = "promo-status";
    promoInput.focus();
});

promoCancel.addEventListener("click", () => {
    promoModal.classList.remove("active");
});

promoModal.addEventListener("click", e => {
    if (e.target === promoModal) promoModal.classList.remove("active");
});

// ===== Мок-логика промокода (без реальной базы) =====
// Здесь позже прикрутим Firebase / Supabase
async function redeemPromoMock(code) {
    await new Promise(r => setTimeout(r, 600)); // псевдо-задержка

    // пример: один валидный код
    if (code === "WARZONE2025") {
        return {
            success: true,
            message: "Промокод активирован! +500 CR",
            rewardAmount: 500,
        };
    }

    return {
        success: false,
        message: "Неверный или уже использованный промокод.",
    };
}

const balanceEl = document.getElementById("balance");

promoApply.addEventListener("click", async () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) return;

    promoStatus.textContent = "Проверяем промокод...";
    promoStatus.className = "promo-status";

    const result = await redeemPromoMock(code);

    if (result.success) {
        promoStatus.textContent = result.message;
        promoStatus.className = "promo-status ok";

        // Обновляем баланс визуально (чисто фронт)
        const current = parseInt(balanceEl.textContent || "0", 10);
        balanceEl.textContent = current + (result.rewardAmount || 0);
    } else {
        promoStatus.textContent = result.message;
        promoStatus.className = "promo-status error";
    }
});

// ===== Мок-данные чата, дропа, магазина и рынка =====
const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

function addChatMessage(author, text, type = "user") {
    const row = document.createElement("div");
    row.classList.add("chat-message");

    const authorSpan = document.createElement("span");
    authorSpan.classList.add("chat-author");
    authorSpan.textContent = type === "system" ? "[system]" : author;

    const textSpan = document.createElement("span");
    textSpan.classList.add(type === "system" ? "chat-system" : "chat-text");
    textSpan.textContent = text;

    row.appendChild(authorSpan);
    row.appendChild(textSpan);

    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatSend.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addChatMessage("Ты", text);
    chatInput.value = "";
});

chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        chatSend.click();
    }
});

// Пример стартовых сообщений
addChatMessage("system", "Добро пожаловать в WARZONE HUB.", "system");
addChatMessage("system", "Активируй промокод WARZONE2025, чтобы получить тестовую валюту.", "system");

// Логи дропа
const dropLog = document.getElementById("dropLog");

function addDropLog(player, item, time) {
    const row = document.createElement("div");
    row.classList.add("log-entry");

    const left = document.createElement("div");
    const right = document.createElement("div");

    const playerSpan = document.createElement("span");
    playerSpan.classList.add("log-player");
    playerSpan.textContent = player;

    const itemSpan = document.createElement("span");
    itemSpan.classList.add("log-item");
    itemSpan.textContent = `получил ${item}`;

    left.appendChild(playerSpan);
    left.appendChild(document.createTextNode(" "));
    left.appendChild(itemSpan);

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("log-time");
    timeSpan.textContent = time;

    right.appendChild(timeSpan);

    row.appendChild(left);
    row.appendChild(right);
    dropLog.appendChild(row);
    dropLog.scrollTop = dropLog.scrollHeight;
}

// Пример логов
addDropLog("Player#3301", "AK-47 | Neon Storm", "12:41");
addDropLog("Player#1488", "Knife | Gamma Edge", "12:39");
addDropLog("Player#7777", "Pistol | Pink Pulse", "12:35");

// Магазин / рынок
const shopGrid = document.getElementById("shopGrid");
const marketGrid = document.getElementById("marketGrid");

function createCard({ title, rarity, price, owner, actionText }) {
    const card = document.createElement("div");
    card.classList.add("card");

    const titleEl = document.createElement("div");
    titleEl.classList.add("card-title");
    titleEl.textContent = title;

    const meta = document.createElement("div");
    meta.classList.add("card-meta");
    meta.textContent = rarity;

    const priceEl = document.createElement("div");
    priceEl.classList.add("card-price");
    priceEl.textContent = `${price} CR`;

    const footer = document.createElement("div");
    footer.classList.add("card-footer");

    const ownerEl = document.createElement("span");
    ownerEl.classList.add("card-meta");
    ownerEl.textContent = owner || "Магазин";

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-outline");
    btn.textContent = actionText;

    footer.appendChild(ownerEl);
    footer.appendChild(btn);

    card.appendChild(titleEl);
    card.appendChild(meta);
    card.appendChild(priceEl);
    card.appendChild(footer);

    return card;
}

// Примеры товаров магазина
[
    { title: "AK-47 | Neon Storm", rarity: "Legendary", price: 1200, actionText: "Купить" },
    { title: "M4A1 | Cyan Pulse", rarity: "Epic", price: 800, actionText: "Купить" },
    { title: "Knife | Void Edge", rarity: "Mythic", price: 2200, actionText: "Купить" },
].forEach(item => {
    shopGrid.appendChild(createCard({ ...item, owner: "WARZONE" }));
});

// Примеры лотов рынка
[
    { title: "Deagle | Hyper Pink", rarity: "Rare", price: 350, owner: "Player#5490", actionText: "Купить" },
    { title: "SMG | Toxic Flow", rarity: "Epic", price: 960, owner: "Player#2201", actionText: "Купить" },
].forEach(item => {
    marketGrid.appendChild(createCard(item));
});
