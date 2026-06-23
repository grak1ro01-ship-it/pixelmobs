/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

WA.onInit().then(() => {
    console.log('API ready');

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

    // ========================================================
    // 1. ЛОГИКА ДВЕРЕЙ
    // ========================================================
    function simpleOpenCloseDoors(suffix: string) {
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
    // 2. ЛОГИКА ИНТЕРАКТИВНОГО ТЕННИСА
    // ========================================================
    let tennisGame: ReturnType<typeof WA.room.website.create> | null = null;

    WA.room.onEnterZone('tennis_zone', () => {
        WA.chat.sendChatMessage("Вы наступили на зону теннисного стола!", "Отладка");

        if (!tennisGame) {
            try {
                // Все координаты и размеры упакованы строго внутрь position
                // Используем allowApi: true, чтобы обойти политику безопасности iframe
                tennisGame = WA.room.website.create({
                    name: "pong_game_screen",
                    url: "https://playtictactoe.org/pong", 
                    origin: "player", // Планшет поверх экрана для гарантированного теста
                    position: {
                        x: 20, 
                        y: 20, 
                        width: 450,   
                        height: 350
                    },
                    allow: "autoplay",
                    allowApi: true 
                });

                WA.chat.sendChatMessage("🏓 Теннис активирован! Управление: W/S и Стрелочки.", "Система");
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

export {};
