import { useState } from 'react';

export const useEnemy = () => {
  const INITIAL_STATE = {
    name: "Рошан",
    enemyHp: 500,
    maxHp: 500,
    enemyDamage: 1,
    critChance: 5 // %
  };

  const [enemy, setEnemy] = useState(INITIAL_STATE);

  const takeDamage = (amount) => {
    setEnemy(prev => ({ ...prev, enemyHp: Math.max(0, prev.enemyHp - amount) }));
  };

  const dealDamage = () => {
    if (enemy.enemyHp <= 0) return { damage: 0, isCrit: false };
    const rand = Math.random() * 100;
    const isCrit = rand < (enemy.critChance || 0);
    const dmg = isCrit ? Math.round(enemy.enemyDamage * 1.5) : enemy.enemyDamage;
    return { damage: dmg, isCrit };
  };

  const increaseDamage = (amount) => {
    setEnemy(prev => ({ ...prev, enemyDamage: prev.enemyDamage + amount }));
  };

  const increaseCritChance = (amountPercent) => {
    setEnemy(prev => ({ ...prev, critChance: Math.min(100, (prev.critChance || 0) + amountPercent) }));
  };

  const resetEnemy = () => setEnemy(INITIAL_STATE);

  return { enemy, takeDamage, dealDamage, increaseDamage, increaseCritChance, resetEnemy };
};
