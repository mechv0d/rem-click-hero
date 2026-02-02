import { useState, useEffect, useRef } from 'react';
import { ENEMY_RESPAWN_DELAY_MS } from '../config';
import { useHero } from './useHero';
import { useEnemy } from './useEnemy';

export const useLogic = () => {
  const { hero, performAttack: heroAttackAction, takeDamage: damageHero, rest, buyUpgrade, resetHero, restoreRestCharge, buyRestCharge, gainLevel, addExp, expRequiredForLevel, addGold } = useHero();
  const { enemy, takeDamage: damageEnemy, dealDamage: getEnemyDamage, increaseDamage, increaseCritChance, resetEnemy, spawnRandomEnemy } = useEnemy();
  const [isSearchingNewEnemy, setIsSearchingNewEnemy] = useState(false);
  const respawnTimeoutRef = useRef(null);
  const [attackCount, setAttackCount] = useState(0);
  
  const [gameState, setGameState] = useState({
    isGameOver: false,
    statusMessage: 'Бой начался!',
    statusType: 'neutral'
  });

  // Проверка условий победы/поражения
  useEffect(() => {
    if (gameState.isGameOver) return;

    if (hero.heroHp <= 0) {
      setGameState({ isGameOver: true, statusMessage: '💀 Герой пал в бою', statusType: 'loss' });
    } else if (hero.gold >= 1000) {
      setGameState({ isGameOver: true, statusMessage: '💰 Вы собрали 1000 золота! Победа!', statusType: 'win' });
    }
  }, [hero.heroHp, hero.gold, gameState.isGameOver]);

  // Инициализация первого врага при старте
  useEffect(() => {
    spawnRandomEnemy(hero.level || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAttack = () => {
    if (gameState.isGameOver) return;

    if (hero.energy <= 0) {
      setGameState(prev => ({ ...prev, statusMessage: '💤 Нет энергии. Нужно отдохнуть!' }));
      return;
    }

    const { damage: dmgDealt, isCrit: heroCrit } = heroAttackAction();
    damageEnemy(dmgDealt);

    // Инкрементируем счётчик атак и каждые 5 атак увеличиваем урон орка на 1
    // и каждые 10 атак увеличиваем шанс крита орка на 5%
    setAttackCount(prevCount => {
      const next = prevCount + 1;
      if (next % 5 === 0) {
        increaseDamage(1);
      }
      if (next % 10 === 0) {
        increaseCritChance(5);
      }
      if (next % 4 === 0) {
        restoreRestCharge();
      }
      return next;
    });

    const enemyWillRemain = enemy.enemyHp - dmgDealt > 0;
    let enemyDmg = 0;
    let enemyCrit = false;
    if (enemyWillRemain) {
      const enemyAttack = getEnemyDamage();
      enemyDmg = enemyAttack.damage;
      enemyCrit = enemyAttack.isCrit;
      if (enemyDmg > 0) damageHero(enemyDmg);
    } else {
    // враг убит — даём EXP и случайный дроп золота герою, считаем возможные повышения уровня
      const enemyExp = enemy.exp || 0;
      const goldMin = (enemy.goldMin || 0);
      const goldMax = (enemy.goldMax || 0);
      const coinDrop = goldMax >= goldMin ? Math.floor(Math.random() * (goldMax - goldMin + 1)) + goldMin : 0;

      // локально вычисляем новый уровень после добавления EXP (не полагаемся на асинхронный setState)
      let projectedExp = (hero.exp || 0) + enemyExp;
      let projectedLevel = hero.level || 1;
      while (projectedExp >= expRequiredForLevel(projectedLevel)) {
        projectedExp -= expRequiredForLevel(projectedLevel);
        projectedLevel += 1;
      }

      // применяем EXP и золото к герою
      addExp(enemyExp);
      if (coinDrop > 0) addGold(coinDrop);
      // пометим что ищем нового врага и покажем сообщение, затем через задержку заспавним нового
      setIsSearchingNewEnemy(true);
      const levelGain = (projectedLevel - (hero.level || 1));
      setGameState(prev => ({ ...prev, statusMessage: `🏆 Враг повержен! Получено ${enemyExp} EXP и ${coinDrop} золота${levelGain > 0 ? ` — уровень +${levelGain} (теперь ${projectedLevel})` : ''}`, statusType: 'win' }));

      // очистка старого таймаута, если есть
      if (respawnTimeoutRef.current) {
        clearTimeout(respawnTimeoutRef.current);
        respawnTimeoutRef.current = null;
      }

      respawnTimeoutRef.current = setTimeout(() => {
        spawnRandomEnemy(projectedLevel);
        setIsSearchingNewEnemy(false);
        setGameState(prev => ({ ...prev, statusMessage: '🔍 Новый враг найден!', statusType: 'neutral' }));
        respawnTimeoutRef.current = null;
      }, ENEMY_RESPAWN_DELAY_MS);
    }

    // Приоритет для сообщения: если герой сделал крит — показываем его крит, иначе если критнул орк — показываем крит орка, иначе обычное сообщение
    if (heroCrit) {
      setGameState(prev => ({ ...prev, statusMessage: `💥 КРИТ! Герой нанес ${dmgDealt} урона`, statusType: 'crit' }));
    } else if (enemyCrit) {
      setGameState(prev => ({ ...prev, statusMessage: `💥 КРИТ! Орк нанес ${enemyDmg} урона`, statusType: 'crit' }));
    } else {
      setGameState(prev => ({ ...prev, statusMessage: `Атака! Нанесено ${dmgDealt}, получено ${enemyDmg}`, statusType: 'neutral' }));
    }
  };

  const handleRest = () => {
    if (gameState.isGameOver) return;
    const success = rest();
    if (success != false) {
      setGameState(prev => ({ ...prev, statusMessage: '✨ Отдых совершен: восстановлена энергия и ХП', statusType: 'neutral' }));
    } else {
      setGameState(prev => ({ ...prev, statusMessage: '✨ Отдых совершен: восстановлена энергия и ХП', statusType: 'neutral' }));
    }
  };

  const handleBuyCharge = () => {
    if (gameState.isGameOver) return;
    const success = buyRestCharge();
    if (success) {
      setGameState(prev => ({ ...prev, statusMessage: '🔋 Куплен заряд отдыха', statusType: 'neutral' }));
    } else {
      setGameState(prev => ({ ...prev, statusMessage: '❌ Не удалось купить заряд', statusType: 'neutral' }));
    }
  };

  const handleBuy = (item) => {
    if (gameState.isGameOver) return;
    const success = buyUpgrade(item);
    if (success) {
      setGameState(prev => ({ ...prev, statusMessage: `💰 Куплено: ${item.name}` }));
    } else {
      setGameState(prev => ({ ...prev, statusMessage: '❌ Недостаточно золота!' })); 
    }
  };

  const handleRestart = () => {
    resetHero();
    resetEnemy();
    setAttackCount(0);
    // очистим таймаут респауна если был
    if (respawnTimeoutRef.current) {
      clearTimeout(respawnTimeoutRef.current);
      respawnTimeoutRef.current = null;
    }
    setIsSearchingNewEnemy(false);
    setGameState({ isGameOver: false, statusMessage: 'Бой начался заново!', statusType: 'neutral' });
  };

  return {
    hero,
    enemy,
    isSearchingNewEnemy,
    gameState,
    actions: {
      attack: handleAttack,
      rest: handleRest,
      buy: handleBuy,
      buyCharge: handleBuyCharge,
      restart: handleRestart
    }
  };
};
