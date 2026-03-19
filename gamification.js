// ===== GAMIFICATION.JS =====

var GP_XP_KEY  = 'gp_xp';
var GP_ACH_KEY = 'gp_ach';

var GP_LEVELS = [
    { name: '🎮 Новичок',  min: 0    },
    { name: '🕹️ Геймер',   min: 100  },
    { name: '💥 Хардкор',  min: 300  },
    { name: '🔥 Легенда',  min: 700  },
    { name: '👑 Мастер',   min: 1500 },
];

var GP_ACHIEVEMENTS = [
    { id: 'first_game',    icon: '👀', name: 'Первый взгляд',    desc: 'Открыл первую игру',              xp: 10  },
    { id: 'games_5',       icon: '🎯', name: 'Исследователь',    desc: 'Открыл 5 разных игр',             xp: 25  },
    { id: 'games_20',      icon: '🗺️', name: 'Путешественник',   desc: 'Открыл 20 разных игр',            xp: 50  },
    { id: 'first_fav',     icon: '⭐', name: 'Первая любовь',    desc: 'Добавил игру в избранное',        xp: 10  },
    { id: 'favs_5',        icon: '💛', name: 'Коллекционер',     desc: '5 игр в избранном',               xp: 30  },
    { id: 'favs_10',       icon: '💎', name: 'Куратор',          desc: '10 игр в избранном',              xp: 60  },
    { id: 'used_filter',   icon: '🔍', name: 'Фильтролог',       desc: 'Использовал фильтр по жанру',     xp: 15  },
    { id: 'used_compare',  icon: '⚔️', name: 'Аналитик',         desc: 'Сравнил две игры',                xp: 20  },
    { id: 'used_random',   icon: '🎲', name: 'Везунчик',         desc: 'Открыл случайную игру',           xp: 10  },
    { id: 'used_search',   icon: '🔎', name: 'Сыщик',            desc: 'Воспользовался поиском',          xp: 10  },
    { id: 'changed_theme', icon: '🎨', name: 'Стилист',          desc: 'Сменил тему оформления',          xp: 10  },
    { id: 'set_pc',        icon: '🖥️', name: 'Конфигуратор',     desc: 'Заполнил данные своего ПК',       xp: 20  },
    { id: 'night_owl',     icon: '🦉', name: 'Ночная сова',      desc: 'Открыл сайт после полуночи',      xp: 15  },
    { id: 'xp_500',        icon: '🚀', name: 'На подъёме',       desc: 'Набрал 500 XP',                   xp: 50  },
    { id: 'level_master',  icon: '👑', name: 'Мастер GamePulse', desc: 'Достиг максимального уровня',     xp: 0   },
];

function gpGetXP() {
    return parseInt(localStorage.getItem(GP_XP_KEY) || '0');
}
function gpGetUnlocked() {
    try { return JSON.parse(localStorage.getItem(GP_ACH_KEY) || '[]'); } catch(e) { return []; }
}
function gpGetLevel(xp) {
    var level = GP_LEVELS[0];
    for (var i = 0; i < GP_LEVELS.length; i++) {
        if (xp >= GP_LEVELS[i].min) level = GP_LEVELS[i];
    }
    return level;
}

function gpAddXP(amount) {
    if (!amount) return;
    localStorage.setItem(GP_XP_KEY, gpGetXP() + amount);
    gpUpdateLevelUI();
}

function gpUnlock(id) {
    var unlocked = gpGetUnlocked();
    if (unlocked.indexOf(id) !== -1) return;
    var ach = null;
    for (var i = 0; i < GP_ACHIEVEMENTS.length; i++) {
        if (GP_ACHIEVEMENTS[i].id === id) { ach = GP_ACHIEVEMENTS[i]; break; }
    }
    if (!ach) return;
    unlocked.push(id);
    localStorage.setItem(GP_ACH_KEY, JSON.stringify(unlocked));
    gpAddXP(ach.xp);
    gpShowAchToast(ach);
    gpRenderAchievements();
    if (gpGetXP() >= 1500) gpUnlock('level_master');
}

function gpShowAchToast(ach) {
    var box = document.getElementById('toastContainer');
    if (!box) return;
    var t = document.createElement('div');
    t.className = 'gp-toast success';
    t.style.borderColor = 'gold';
    t.innerHTML = '<span style="font-size:1.4rem">' + ach.icon + '</span>'
        + '<div><div style="font-weight:700;font-size:0.88rem">🏆 Достижение!</div>'
        + '<div style="font-size:0.8rem">' + ach.name + ' +' + ach.xp + ' XP</div></div>';
    box.appendChild(t);
    setTimeout(function() {
        t.classList.add('out');
        setTimeout(function() { t.remove(); }, 300);
    }, 4000);
}

function gpUpdateLevelUI() {
    var xp       = gpGetXP();
    var level    = gpGetLevel(xp);
    var idx      = GP_LEVELS.indexOf(level);
    var next     = GP_LEVELS[idx + 1];
    var badge    = document.getElementById('profileLevelBadge');
    var xpText   = document.getElementById('profileXPText');
    var xpBar    = document.getElementById('profileXPBar');
    var xpNext   = document.getElementById('profileXPNext');
    if (badge)  badge.textContent = level.name;
    if (xpText) xpText.textContent = xp + ' XP';
    if (xpBar)  xpBar.style.width = (next ? Math.min(100, Math.round((xp - level.min) / (next.min - level.min) * 100)) : 100) + '%';
    if (xpNext) xpNext.textContent = next ? ('до ' + next.name + ': ' + (next.min - xp) + ' XP') : 'Максимальный уровень!';
}

window.gpRenderAchievements = function() {
    var grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    var unlocked = gpGetUnlocked();
    grid.innerHTML = '';
    GP_ACHIEVEMENTS.forEach(function(ach) {
        var done = unlocked.indexOf(ach.id) !== -1;
        var card = document.createElement('div');
        card.className = 'achievement-card' + (done ? ' unlocked' : '');
        card.innerHTML =
            '<div class="ach-icon">' + ach.icon + '</div>'
            + '<div class="ach-info">'
            +   '<div class="ach-name">' + ach.name + '</div>'
            +   '<div class="ach-desc">' + (done ? ach.desc : '???') + '</div>'
            + '</div>'
            + '<div class="ach-xp">+' + ach.xp + ' XP</div>';
        grid.appendChild(card);
    });
};

// Публичные триггеры
window.gpTrackGame = function(gameId) {
    var key = 'gp_viewed';
    var viewed;
    try { viewed = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { viewed = []; }
    if (viewed.indexOf(gameId) === -1) {
        viewed.push(gameId);
        localStorage.setItem(key, JSON.stringify(viewed));
    }
    var n = viewed.length;
    if (n >= 1)  gpUnlock('first_game');
    if (n >= 5)  gpUnlock('games_5');
    if (n >= 20) gpUnlock('games_20');
    if (gpGetXP() >= 500) gpUnlock('xp_500');
};

window.gpTrackFavs = function(count) {
    if (count >= 1)  gpUnlock('first_fav');
    if (count >= 5)  gpUnlock('favs_5');
    if (count >= 10) gpUnlock('favs_10');
};

window.gpTrackAction = function(action) {
    var map = { filter:'used_filter', compare:'used_compare', random:'used_random', search:'used_search', theme:'changed_theme', set_pc:'set_pc' };
    if (map[action]) gpUnlock(map[action]);
    if (gpGetXP() >= 500) gpUnlock('xp_500');
};

// Авто-триггеры при загрузке
(function() {
    if (new Date().getHours() < 5) gpUnlock('night_owl');
    gpUpdateLevelUI();
}());
