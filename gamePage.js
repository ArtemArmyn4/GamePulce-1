// gamePage.js
// Предполагается, что глобальные объекты games и lang уже загружены, а также доступна функция getDoctorVerdict из script.js

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

if (!gameId || !games[gameId]) {
    document.body.innerHTML = '<h1 style="text-align: center; margin-top: 50px;">Игра не найдена / Game not found</h1>';
} else {
    const game = games[gameId];
    const currentLang = localStorage.getItem('gamepulse_lang') || 'ru';
    
    // Заполняем заголовок
    document.getElementById('gameTitle').innerText = game[`title_${currentLang}`];
    
    // Трейлер (если есть)
    const trailerIframe = document.getElementById('gameTrailer');
    if (game.trailer) {
        trailerIframe.src = game.trailer;
    } else {
        trailerIframe.style.display = 'none';
    }
    
    // Описание
    document.getElementById('gameDescription').innerText = game[`desc_${currentLang}`];
    
    // Минимальные требования (массив строк)
    const minList = game.min.map(item => `<li>${item}</li>`).join('');
    document.getElementById('minReq').innerHTML = `<ul>${minList}</ul>`;
    
    // Рекомендуемые требования
    const recList = game.rec.map(item => `<li>${item}</li>`).join('');
    document.getElementById('recReq').innerHTML = `<ul>${recList}</ul>`;
    
    // Время прохождения
    if (game.playtime_main && game.playtime_completion) {
        const playtimeHtml = `
            <div class="modal-playtime" style="margin-top:15px;">
                <h4 style="color:var(--accent);">${lang[currentLang].playtime_title || '⏱️ Время прохождения'}</h4>
                <p>📖 ${lang[currentLang].playtime_main || 'Основной сюжет'}: ${game.playtime_main} ч</p>
                <p>🏆 ${lang[currentLang].playtime_completion || '100% прохождение'}: ${game.playtime_completion} ч</p>
            </div>
        `;
        document.querySelector('.requirements').insertAdjacentHTML('afterend', playtimeHtml);
    }
    
    // Оценки
    if (game.metacritic || game.steam || game.ign) {
        const ratingsHtml = `
            <div class="modal-ratings" style="margin-top:15px;">
                <h4 style="color:var(--accent);">${lang[currentLang].ratings_title || '📊 Оценки'}</h4>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    ${game.metacritic ? `<div><strong>${lang[currentLang].metacritic_label}:</strong> ${game.metacritic}</div>` : ''}
                    ${game.steam ? `<div><strong>${lang[currentLang].steam_label}:</strong> ${game.steam}</div>` : ''}
                    ${game.ign ? `<div><strong>${lang[currentLang].ign_label}:</strong> ${game.ign}</div>` : ''}
                </div>
            </div>
        `;
        document.querySelector('.requirements').insertAdjacentHTML('afterend', ratingsHtml);
    }
    
    // Сборка ПК
    if (game.build) {
        const buildHtml = `
            <div class="modal-build" style="margin-top:15px;">
                <h4 style="color:var(--accent);">${lang[currentLang].build_title || '🧩 Собери идеальный ПК под игру'}</h4>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div><strong>${lang[currentLang].build_cpu || 'Процессор'}:</strong> ${game.build.cpu}</div>
                    <div><strong>${lang[currentLang].build_gpu || 'Видеокарта'}:</strong> ${game.build.gpu}</div>
                    <div><strong>${lang[currentLang].build_ram || 'Оперативная память'}:</strong> ${game.build.ram} GB</div>
                </div>
            </div>
        `;
        document.querySelector('.requirements').insertAdjacentHTML('afterend', buildHtml);
    }
    
    // Гейм-доктор (вызываем глобальную функцию из script.js)
    const doctorDiv = document.createElement('div');
    doctorDiv.className = 'doctor-block';
    doctorDiv.style.marginTop = '20px';
    doctorDiv.innerHTML = `
        <h4 style="color:var(--accent);">${lang[currentLang].doctorTitle || '🤖 Гейм-Доктор'}</h4>
        <p>${window.getDoctorVerdict ? window.getDoctorVerdict(gameId) : 'Заполните данные ПК в настройках'}</p>
    `;
    document.querySelector('.requirements').insertAdjacentElement('afterend', doctorDiv);
}