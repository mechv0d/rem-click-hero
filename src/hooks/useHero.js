import { useState } from 'react';
import { PRICE_INCREASE_FACTOR, BASE_EXP, EXP_GROWTH_FACTOR, HERO_HP_PER_LEVEL, PRICE_DEFAULT_BOUGHT_MULT, PLAYER_CRIT_MULT } from '../config';

export const calculateCost = (cost, lvl = 1, priceMultOnBoughtQuantity = PRICE_DEFAULT_BOUGHT_MULT, boughtCount = 0) => {
  // Level-based scaling
  const levelFactor = (1 + (lvl - 1) * PRICE_INCREASE_FACTOR);
  // Bought-based scaling: apply multiplicative increase per previous purchase
  const boughtFactor = Math.pow(priceMultOnBoughtQuantity || 1, boughtCount || 0);
  const raw = cost * levelFactor * boughtFactor;
  return Math.max(1, Math.round(raw));
};

export const useHero = () => {
  // Настройка масштабирования цен/атрибутов по уровню:
  const INITIAL_STATE = {
    gold: 0,
    energy: 10,
    maxEnergy: 10,
    powerPerClick: 1, // базовый урон за клик
    goldPerAttack: 1, // золото за атаку
    critChance: 5, // процент
    restCharges: 2,
    maxRestCharges: 3,
    restChargeCostPercent: 0.1,
    heroHp: 50,
    maxHp: 50,
    // Словарь приобретённых предметов: { [upgradeId]: count }
    purchasedItems: {},
    // Уровень героя
    level: 1,
    // Текущий накопленный опыт (остаток до следующего уровня)
    exp: 0,
    // EXP, нужный для повышения с текущего уровня
    expToNext: Math.max(1, Math.ceil(BASE_EXP * Math.pow(EXP_GROWTH_FACTOR, 0)))
  };

  

  const [hero, setHero] = useState(INITIAL_STATE);

  const performAttack = () => {
    if (hero.energy <= 0) return { damage: 0, isCrit: false };

    const rand = Math.random() * 100;
    const isCrit = rand < (hero.critChance || 0);
    const baseDmg = hero.powerPerClick;
    const dmg = isCrit ? Math.round(baseDmg * (PLAYER_CRIT_MULT || 1.5)) : baseDmg;

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
      const hpRestore = Math.floor(prev.maxHp * 0.5);
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
    const lvl = hero.level || 1;
    const prevCountForItem = (hero.purchasedItems && hero.purchasedItems[upgrade.id]) || 0;
    const priceMult = (upgrade.priceMultOnBoughtQuantity === undefined ? PRICE_DEFAULT_BOUGHT_MULT : upgrade.priceMultOnBoughtQuantity);
    const scaledCost = calculateCost(cost, lvl, priceMult, prevCountForItem);
    console.log(hero.gold, scaledCost);
    if (hero.gold >= scaledCost) {
      setHero(prev => {
        const lvlPrev = prev.level || 1;
        const newMaxHp = prev.maxHp + (permanentHpBonus * lvlPrev);
        const newMaxEnergy = prev.maxEnergy + (permanentStaminaBonus * lvlPrev);
        const prevCount = (prev.purchasedItems && prev.purchasedItems[upgrade.id]) || 0;
        const newPurchased = { ...(prev.purchasedItems || {}), [upgrade.id]: prevCount + 1 };
        return {
          ...prev,
          gold: prev.gold - scaledCost,
          powerPerClick: prev.powerPerClick + (dmgBonus * lvl),
          heroHp: Math.min(prev.heroHp + (hpBonus * lvl) + (permanentHpBonus * lvl), newMaxHp),
          maxHp: newMaxHp,
          goldPerAttack: prev.goldPerAttack + (goldPerAttackBonus * lvl),
          maxEnergy: newMaxEnergy,
          energy: Math.min(prev.energy + (permanentStaminaBonus * lvl), newMaxEnergy),
          critChance: Math.min(100, (prev.critChance || 0) + critChanceBonus),
          purchasedItems: newPurchased
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

  // Рассчитать требуемый EXP для повышения с заданного уровня на следующий
  const expRequiredForLevel = (level) => Math.max(1, Math.ceil(BASE_EXP * Math.pow(EXP_GROWTH_FACTOR, (level || 1) - 1)));

  // Добавить EXP герою и при необходимости повысить уровень (оставшийся опыт сохраняется)
  const addExp = (amount) => {
    if (!amount || amount <= 0) return;
    setHero(prev => {
      let newExp = (prev.exp || 0) + amount;
      let newLevel = prev.level || 1;
      // пока накопленного EXP хватает на повышение — повышаем уровень и вычитаем требуемое
      let levelGained = 0;
      while (newExp >= expRequiredForLevel(newLevel)) {
        newExp -= expRequiredForLevel(newLevel);
        newLevel += 1;
        levelGained += 1;
      }

      // Apply passive HP increase per level gained
      const prevMaxHp = prev.maxHp || 0;
      const addedHp = (levelGained * (HERO_HP_PER_LEVEL || 0));
      const newMaxHp = prevMaxHp + addedHp;
      const newHeroHp = Math.min((prev.heroHp || 0) + addedHp, newMaxHp);

      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        expToNext: expRequiredForLevel(newLevel),
        maxHp: newMaxHp,
        heroHp: newHeroHp
      };
    });
  };

  // Добавить золото герою
  const addGold = (amount) => {
    if (!amount || amount <= 0) return;
    setHero(prev => ({ ...prev, gold: (prev.gold || 0) + amount }));
  };

  // Повысить уровень героя на 1 (оставлено для обратной совместимости)
  const gainLevel = () => {
    setHero(prev => {
      const lvl = (prev.level || 1) + 1;
      const addedHp = (HERO_HP_PER_LEVEL || 0);
      const newMaxHp = (prev.maxHp || 0) + addedHp;
      const newHeroHp = Math.min((prev.heroHp || 0) + addedHp, newMaxHp);
      return { ...prev, level: lvl, exp: 0, expToNext: expRequiredForLevel(lvl), maxHp: newMaxHp, heroHp: newHeroHp };
    });
  };

  return { hero, performAttack, takeDamage, rest, buyUpgrade, resetHero, restoreRestCharge, buyRestCharge, gainLevel, calculateCost, addExp, expRequiredForLevel, addGold };
};
