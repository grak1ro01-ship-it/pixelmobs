// src/main.ts
console.log('🚀 Скрипт карты успешно запущен!');

WA.onInit().then(() => {
    console.log('✅ API Куб.Мета готово!');

    // =========================================================
    // 1. ТЕСТ ЧАТА
    // =========================================================
    try {
        WA.chat.sendChatMessage('✅ Скрипт успешно подключен!', { 
            scope: 'local', 
            author: 'Система' 
        });
        console.log('✅ Чат работает');
    } catch(e) { 
        console.error('❌ Ошибка чата:', e); 
    }

    // =========================================================
    // 2. ТЕСТ ТЕННИСА (Co-Website справа)
    // =========================================================
    try {
        WA.nav.openCoWebSite(
            'https://playtictactoe.org/pong',
            true,   // allowApi
            '',     // allowPolicy
            60,     // percentWidth (ширина 60% экрана)
            1,      // position
            true,   // closable
            false   // lazy
        ).then(() => {
            console.log('✅ Теннис открыт справа!');
            WA.chat.sendChatMessage('🎾 Теннис открыт!', { scope: 'local', author: 'Система' });
        }).catch(err => {
            console.error('❌ Ошибка открытия тенниса:', err);
        });
    } catch (error) {
        console.error('❌ Ошибка создания тенниса:', error);
    }

    // =========================================================
    // 3. АВТОМАТИЧЕСКИЕ ДВЕРИ (исправлено)
    // =========================================================
    function simpleOpenCloseDoors(suffix: string) {
        // Вход в зону двери
        WA.room.onEnterLayer('doorsteps/doorstep_' + suffix).subscribe(() => {
            console.log(`🚪 Дверь ${suffix} открыта`);
            WA.room.showLayer('doorsAbove/door_opened_' + suffix);
            WA.room.hideLayer('doorsAbove/door_closed_' + suffix);
            WA.room.showLayer('doorsUnder/door_opened_' + suffix);
            WA.room.hideLayer('doorsUnder/door_closed_' + suffix);
        });

        // Выход из зоны двери
        WA.room.onLeaveLayer('doorsteps/doorstep_' + suffix).subscribe(() => {
            console.log(`🚪 Дверь ${suffix} закрыта`);
            WA.room.hideLayer('doorsAbove/door_opened_' + suffix);
            WA.room.showLayer('doorsAbove/door_closed_' + suffix);
            WA.room.hideLayer('doorsUnder/door_opened_' + suffix);
            WA.room.showLayer('doorsUnder/door_closed_' + suffix);
        });
    }

    // Активируем двери
    simpleOpenCloseDoors('main');

    // =========================================================
    // 4. ТЕННИС ПО ЗОНЕ (исправлено с использованием Area)
    // =========================================================
    let tennisOpen = false;

    // Создаем зону для тенниса
    WA.room.area.onEnter('tennis_zone').subscribe(async () => {
        console.log('🎾 Игрок вошел в зону тенниса!');
        
        if (!tennisOpen) {
            try {
                await WA.nav.openCoWebSite(
                    'https://playtictactoe.org/pong',
                    true,
                    '',
                    50,     // Уменьшаем до 50%
                    1,
                    true,
                    false
                );
                tennisOpen = true;
                WA.chat.sendChatMessage('🎾 Нажмите ПРОБЕЛ чтобы играть в теннис!', { scope: 'local', author: 'Система' });
                console.log('✅ Теннис открыт в зоне');
            } catch (error) {
                console.error('❌ Ошибка открытия тенниса в зоне:', error);
            }
        }
    });

    WA.room.area.onLeave('tennis_zone').subscribe(async () => {
        console.log('🎾 Игрок вышел из зоны тенниса');
        
        if (tennisOpen) {
            try {
                // Закрываем все co-websites
                const sites = await WA.nav.getCoWebSites();
                for (const site of sites) {
                    await site.close();
                }
                tennisOpen = false;
                WA.chat.sendChatMessage('🎾 Теннис закрыт', { scope: 'local', author: 'Система' });
                console.log('✅ Теннис закрыт');
            } catch (error) {
                console.error('❌ Ошибка закрытия тенниса:', error);
            }
        }
    });

    // =========================================================
    // 5. ДОПОЛНИТЕЛЬНО: Открытие по нажатию ПРОБЕЛ
    // =========================================================
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && tennisOpen) {
            event.preventDefault();
            console.log('🎾 Игрок нажал ПРОБЕЛ для тенниса');
            // Можно добавить дополнительную логику здесь
        }
    });

    console.log('✅ Все системы запущены!');

}).catch(e => {
    console.error('❌ Критическая ошибка:', e);
});
