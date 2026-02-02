// Общие конфигурации для масштабирования цен, врагов и системы опыта
export const PRICE_INCREASE_FACTOR = 0.6; // на сколько от базовой цены прибавлять за уровень (50% = +0.5 * base per level)
// Значение по умолчанию для множителя цены при покупке (если =1 — цена не меняется при покупке)
export const PRICE_DEFAULT_BOUGHT_MULT = 1.0;
export const ENEMY_HP_SCALE_FACTOR = 1.25;   // на сколько от базовой характеристики умножать за уровень

// Время задержки (ms) между смертью врага и появлением нового
export const ENEMY_RESPAWN_DELAY_MS = 2000;
// --- Параметр пассивного увеличения здоровья героя при повышении уровня (flat) ---
export const HERO_HP_PER_LEVEL = 20;

// --- Параметры системы опыта (EXP) ---
// Базовое количество EXP, требуемое для повышения с 1 -> 2
export const BASE_EXP = 5;
// Множитель роста требуемого EXP на каждый уровень (например 1.4 означает 40% рост в геометрии)
export const EXP_GROWTH_FACTOR = 1.4;
// --- Переменные-множители, применяемые к характеристикам врага в зависимости от уровня героя ---
// Формула: multiplier = Math.max(1, 1 + (heroLevel - 1) * ENEMY_*_LEVEL_MULT)
export const ENEMY_HP_LEVEL_MULT = 2.1;
export const ENEMY_DMG_LEVEL_MULT = 1.8;
export const ENEMY_CRIT_LEVEL_MULT = 1.4;
export const ENEMY_GOLD_SCALE_FACTOR = 1.5;   // на сколько от базовой характеристики умножать за уровень
// --- Множители урона при критическом ударе ---
// Множитель к урону при критическом попадании игрока
export const PLAYER_CRIT_MULT = 1.5;
// Множитель к урону при критическом попадании врага
export const ENEMY_CRIT_MULT = 2.0;
