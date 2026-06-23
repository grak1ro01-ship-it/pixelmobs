console.log('Скрипт карты успешно запущен!');

WA.onInit().then(() => {
    console.log('API Куб.Мета готово!');

    // ========================================================
    // 1. АВТОМАТИЧЕСКИЕ ДВЕРИ
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
    
    // Активируем двери
    simpleOpenCloseDoors("main");

    // ========================================================
    // 2. ИНТЕРАКТИВНЫЙ ТЕННИС
    // ========================================================
    let tennisGame = null;

    WA.room.onEnterZone('tennis_zone', () => {
        WA.chat.sendChatMessage("Вы наступили на зону теннисного стола!", "Отладка");

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
                WA.chat.sendChatMessage("🏓 Теннис активирован!", "Система");
            } catch (error) {
                console.error("Ошибка создания тенниса:", error);
            }
        }
    });

    WA.room.onLeaveZone('tennis_zone', () => {
        WA.chat.sendChatMessage("Вы вышли из зоны теннисного стола.", "Отладка");
        if (tennisGame) {
            WA.room.website.delete("pong_game_screen");
            tennisGame = null;
        }
    });

}).catch(e => console.error(e));
