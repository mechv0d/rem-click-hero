import { useState, useEffect } from 'react';
import { useHero } from './useHero';
import { useEnemy } from './useEnemy';

export const useLogic = () => {
  const { hero, performAttack: heroAttackAction, takeDamage: damageHero, rest, buyUpgrade, resetHero, restoreRestCharge, buyRestCharge } = useHero();
  const { enemy, takeDamage: damageEnemy, dealDamage: getEnemyDamage, increaseDamage, increaseCritChance, resetEnemy } = useEnemy();
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
    } else if (enemy.enemyHp <= 0) {
      setGameState({ isGameOver: true, statusMessage: '🏆 Вы победили врага!', statusType: 'win' });
    } else if (hero.gold >= 100) {
      setGameState({ isGameOver: true, statusMessage: '💰 Вы собрали 100 золота! Победа!', statusType: 'win' });
    }
  }, [hero.heroHp, hero.gold, enemy.enemyHp, gameState.isGameOver]);

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
    setGameState({ isGameOver: false, statusMessage: 'Бой начался заново!', statusType: 'neutral' });
  };

  return {
    hero,
    enemy,
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
