console.log('Скрипт карты успешно запущен!');

WA.onInit().then(() => {
    console.log('API Куб.Мета готово!');

    // 1. ТЕСТ ЧАТА: Отправляем сообщение локально по НОВОЙ инструкции
    try {
        WA.chat.sendChatMessage('Скрипт успешно подключен! Новая система чата работает.', { 
            scope: 'local', 
            author: 'Система Отладки' 
        });
    } catch(e) { 
        console.error("Ошибка чата при старте:", e); 
    }

    // 2. ТЕСТ ТЕННИСА: Принудительный вызов окна сразу при входе (в обход всех зон)
    try {
        WA.room.website.create({
            name: "pong_game_screen_TEST",
            url: "https://playtictactoe.org/pong", 
            origin: "player", 
            position: {
                x: 50, 
                y: 50, 
                width: 500,   
                height: 400
            },
            allow: "autoplay",
            allowApi: true 
        });
        console.log("Тестовое окно тенниса успешно вызвано!");
    } catch (error) {
        console.error("Ошибка принудительного вызова тенниса:", error);
    }

    // ========================================================
    // 3. ЛОГИКА АВТОМАТИЧЕСКИХ ДВЕРЕЙ
    // ========================================================
    function simpleOpenCloseDoors(suffix) {
        WA.room.onEnterLayer('doorsteps/doorstep_' + suffix).subscribe(() => {
            WA.room.showLayer('doorsAbove/door_opened_' + suffix);
            WA.room.hideLayer('doorsAbove/door_closed_' + suffix);
            WA.room.showLayer('doorsUnder/door_opened_' + suffix);
            WA.room.hideLayer('doorsUnder/door_closed_' + suffix);
        });

        WA.room.onLeaveLayer('doorsteps/doorstep_' + suffix).subscribe(() => {
            WA.room.hideLayer('doorsAbove/door_opened_' + suffix);
            WA.room.showLayer('doorsAbove/door_closed_' + suffix);
            WA.room.hideLayer('doorsUnder/door_opened_' + suffix);
            WA.room.showLayer('doorsUnder/door_closed_' + suffix);
        });
    }
    simpleOpenCloseDoors("main");

    // ========================================================
    // 4. ЛОГИКА ИНТЕРАКТИВНОГО ТЕННИСА (ПО ЗОНЕ)
    // ========================================================
    let tennisGame = null;

    WA.room.onEnterZone('tennis_zone', () => {
        console.log("Игрок вошел в tennis_zone");
        try {
            WA.chat.sendChatMessage('Вы наступили на зону теннисного стола!', { scope: 'local', author: 'Отладка' });
        } catch(e) {}

        if (!tennisGame) {
            try {
                tennisGame = WA.room.website.create({
                    name: "pong_game_screen",
                    url: "https://playtictactoe.org/pong", 
                    origin: "player", 
                    position: {
                        x: 20, 
                        y: 20, 
                        width: 450,   
                        height: 350
                    },
                    allow: "autoplay",
                    allowApi: true 
                });
            } catch (error) {
                console.error("Ошибка создания тенниса в зоне:", error);
            }
        }
    });

    WA.room.onLeaveZone('tennis_zone', () => {
        console.log("Игрок вышел из tennis_zone");
        try {
            WA.chat.sendChatMessage('Вы вышли из зоны теннисного стола.', { scope: 'local', author: 'Отладка' });
        } catch(e) {}
        
        if (tennisGame) {
            WA.room.website.delete("pong_game_screen");
            tennisGame = null;
        }
    });

}).catch(e => console.error(e));
