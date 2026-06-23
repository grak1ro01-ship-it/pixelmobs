// src/test.ts - Упрощенный тестовый скрипт

// Ожидаем инициализации API
(async () => {
    try {
        console.log('🧪 Начинаем тестирование API...');
        
        // Ждем инициализации
        await WA.onInit();
        console.log('✅ API инициализирован!');

        // === 1. PLAYER API ===
        console.log('\n📋 ТЕСТИРОВАНИЕ PLAYER API');
        
        try {
            console.log(`   Имя игрока: ${WA.player.name}`);
            console.log(`   ID игрока: ${WA.player.id || 'не задан'}`);
            console.log(`   Язык: ${WA.player.language}`);
            console.log(`   Теги: ${WA.player.tags.join(', ') || 'нет'}`);
            
            const pos = await WA.player.getPosition();
            console.log(`   Позиция: (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
            
            // Проверка Woka
            const woka = await WA.player.getWokaPicture();
            console.log(`   Woka получена: ${woka ? 'да' : 'нет'}`);
            
            // Проверка статуса
            WA.player.setStatus('BUSY');
            console.log('   ✅ Статус изменен на BUSY');
            
            setTimeout(() => {
                WA.player.setStatus('ONLINE');
                console.log('   ✅ Статус восстановлен на ONLINE');
            }, 1000);
            
        } catch (e) {
            console.error('   ❌ Ошибка в PLAYER API:', e);
        }

        // === 2. ROOM API ===
        console.log('\n📋 ТЕСТИРОВАНИЕ ROOM API');
        
        try {
            console.log(`   ID комнаты: ${WA.room.id}`);
            console.log(`   URL карты: ${WA.room.mapURL}`);
            
            const map = await WA.room.getTiledMap();
            console.log(`   Карта загружена, версия Tiled: ${map.tiledversion || 'неизвестна'}`);
            
            // Проверка слоев
            if (map && map.layers) {
                const layerNames = map.layers.map(l => l.name).join(', ');
                console.log(`   Найдены слои: ${layerNames}`);
                
                if (map.layers.length > 0) {
                    const firstLayer = map.layers[0].name;
                    WA.room.showLayer(firstLayer);
                    console.log(`   ✅ Слой "${firstLayer}" показан`);
                    
                    setTimeout(() => {
                        WA.room.hideLayer(firstLayer);
                        console.log(`   ✅ Слой "${firstLayer}" скрыт`);
                        setTimeout(() => WA.room.showLayer(firstLayer), 1000);
                    }, 1000);
                }
            }
            
        } catch (e) {
            console.error('   ❌ Ошибка в ROOM API:', e);
        }

        // === 3. CAMERA API ===
        console.log('\n📋 ТЕСТИРОВАНИЕ CAMERA API');
        
        try {
            WA.camera.followPlayer(true);
            console.log('   ✅ Камера следует за игроком');
            
            const pos = await WA.player.getPosition();
            WA.camera.set(pos.x, pos.y, 320, 240, false, true, 1000);
            console.log(`   ✅ Камера установлена на (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
            
            setTimeout(() => {
                WA.camera.followPlayer(true);
                console.log('   ✅ Камера возвращена к игроку');
            }, 2000);
            
        } catch (e) {
            console.error('   ❌ Ошибка в CAMERA API:', e);
        }

        // === 4. CHAT API ===
        console.log('\n📋 ТЕСТИРОВАНИЕ CHAT API');
        
        try {
            WA.chat.sendChatMessage('🧪 Тестовое сообщение от API', { 
                scope: 'local', 
                author: 'Тестовый Бот' 
            });
            console.log('   ✅ Локальное сообщение отправлено');
            
            WA.chat.sendChatMessage('🧪 Тест пузыря', { scope: 'bubble' });
            console.log('   ✅ Сообщение в пузырь отправлено');
            
        } catch (e) {
            console.error('   ❌ Ошибка в CHAT API:', e);
        }

        // === 5. CONTROLS API ===
        console.log('\n📋 ТЕСТИРОВАНИЕ CONTROLS API');
        
        try {
            WA.controls.disablePlayerControls();
            console.log('   ✅ Управление отключено');
            
            setTimeout(() => {
                WA.controls.restorePlayerControls();
                console.log('   ✅ Управление восстановлено');
            }, 2000);
            
        } catch (e) {
            console.error('   ❌ Ошибка в CONTROLS API:', e);
        }

        // === 6. NAV API ===
        console.log('\n📋 ТЕСТИРОВАНИЕ NAV API');
        
        try {
            // Открываем тестовый сайт в Co-Website
            const coWebsite = await WA.nav.openCoWebSite(
                'https://example.com',
                false,
                '',
                50,
                1,
                true,
                false
            );
            console.log('   ✅ Co-Website открыт');
            
            // Получаем список Co-Websites
            const sites = await WA.nav.getCoWebSites();
            console.log(`   ✅ Найдено сайтов: ${sites.length}`);
            
            // Закрываем через 3 секунды
            if (coWebsite) {
                setTimeout(async () => {
                    await coWebsite.close();
                    console.log('   ✅ Co-Website закрыт');
                }, 3000);
            }
            
        } catch (e) {
            console.error('   ❌ Ошибка в NAV API:', e);
        }

        // === 7. STATE API ===
        console.log('\n📋 ТЕСТИРОВАНИЕ STATE API');
        
        try {
            // Сохраняем переменную
            await WA.player.state.saveVariable('testVar', { value: 42, timestamp: Date.now() }, {
                public: false,
                persist: true
            });
            console.log('   ✅ Переменная сохранена');
            
            // Читаем переменную
            const value = WA.player.state.testVar;
            console.log(`   ✅ Значение: ${JSON.stringify(value)}`);
            
        } catch (e) {
            console.error('   ❌ Ошибка в STATE API:', e);
        }

        // === 8. ИТОГ ===
        console.log('\n============================================');
        console.log('📊 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!');
        console.log('============================================');
        console.log('✅ Если вы видите это сообщение - все основные API работают!');
        console.log('💡 Проверьте консоль на наличие ошибок выше');
        console.log('============================================\n');

    } catch (error) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error);
    }
})();

// Добавляем функцию для повторного запуска
(window as any).runTests = () => {
    console.log('🔄 Повторный запуск тестов...');
    location.reload();
};

console.log('🧪 Для повторного запуска тестов введите: runTests()');
