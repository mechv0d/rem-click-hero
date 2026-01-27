import { useState } from 'react';

export const useHero = () => {
  const INITIAL_STATE = {
    gold: 0,
    energy: 10,
    maxEnergy: 10,
    powerPerClick: 1, // базовый урон за клик
    goldPerAttack: 1, // золото за атаку
    critChance: 10, // процент
    restCharges: 2,
    maxRestCharges: 3,
    restChargeCostPercent: 0.1,
    heroHp: 30,
    maxHp: 30,
  };

  const [hero, setHero] = useState(INITIAL_STATE);

  const performAttack = () => {
    if (hero.energy <= 0) return { damage: 0, isCrit: false };

    const rand = Math.random() * 100;
    const isCrit = rand < (hero.critChance || 0);
    const baseDmg = hero.powerPerClick;
    const dmg = isCrit ? Math.round(baseDmg * 1.5) : baseDmg;

    // Наносим урон и начисляем золото за атаку
    setHero(prev => ({
      ...prev,
      energy: prev.energy - 1,
      gold: prev.gold + (prev.goldPerAttack || 0)
    }));

    return { damage: dmg, isCrit };
  };

  const takeDamage = (amount) => {
    setHero(prev => ({ ...prev, heroHp: Math.max(0, prev.heroHp - amount) }));
  };

  const rest = () => {
    let success = false;
    setHero(prev => {
      if (!prev.restCharges || prev.restCharges <= 0) return prev;
      const hpRestore = Math.floor(prev.maxHp * 0.4);
      const energyRestore = Math.floor(prev.maxEnergy * 0.33);
      success = true;
      return {
        ...prev,
        restCharges: prev.restCharges - 1,
        energy: Math.min(prev.energy + energyRestore, prev.maxEnergy),
        heroHp: Math.min(prev.heroHp + hpRestore, prev.maxHp)
      };
    });
    return success;
  };

  // Применяет апгрейд-объект с разными бонусами
  const buyUpgrade = (upgrade) => {
    const { cost, dmgBonus = 0, hpBonus = 0, goldPerAttackBonus = 0, permanentHpBonus = 0, permanentStaminaBonus = 0, critChanceBonus = 0 } = upgrade;
    if (hero.gold >= cost) {
      setHero(prev => {
        const newMaxHp = prev.maxHp + permanentHpBonus;
        const newMaxEnergy = prev.maxEnergy + permanentStaminaBonus;
        return {
          ...prev,
          gold: prev.gold - cost,
          powerPerClick: prev.powerPerClick + dmgBonus,
          heroHp: Math.min(prev.heroHp + hpBonus + permanentHpBonus, newMaxHp),
          maxHp: newMaxHp,
          goldPerAttack: prev.goldPerAttack + goldPerAttackBonus,
          maxEnergy: newMaxEnergy,
          energy: Math.min(prev.energy + permanentStaminaBonus, newMaxEnergy),
          critChance: Math.min(100, (prev.critChance || 0) + critChanceBonus)
        };
      });
      return true;
    }
    return false;
  };

  // Восстановить один заряд отдыха (вызывается извне)
  const restoreRestCharge = () => {
    setHero(prev => {
      const maxC = prev.maxRestCharges || 3;
      const current = prev.restCharges || 0;
      if (current >= maxC) return prev;
      return { ...prev, restCharges: current + 1 };
    });
  };

  // Купить один заряд отдыха: стоимость = 10% от maxHp (целое), после покупки maxHp уменьшается на cost
  const buyRestCharge = () => {
    const percent = hero.restChargeCostPercent || 0.1;
    const cost = Math.max(3, Math.floor(hero.maxHp * percent));
    if (hero.maxHp > cost && hero.restCharges < hero.maxRestCharges) {
      setHero(prev => {
        const newMaxHp = prev.maxHp - cost;
        const newCharges = Math.min((prev.restCharges || 0) + 1, prev.maxRestCharges || 3);
        return {
          ...prev,
          maxHp: newMaxHp,
          heroHp: Math.min(prev.heroHp, newMaxHp),
          restCharges: newCharges,
          restChargeCostPercent: Math.min(1, (prev.restChargeCostPercent || 0.1) * 1.05)
        };
      });
      return true;
    }
    return false;
  };

  const resetHero = () => setHero(INITIAL_STATE);

  return { hero, performAttack, takeDamage, rest, buyUpgrade, resetHero, restoreRestCharge, buyRestCharge };
};
