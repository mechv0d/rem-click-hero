import { useState } from 'react';
import {
  ENEMY_GOLD_SCALE_FACTOR,
  ENEMY_HP_LEVEL_MULT,
  ENEMY_DMG_LEVEL_MULT,
  ENEMY_CRIT_LEVEL_MULT,
  ENEMY_CRIT_MULT
} from '../config';

const ENEMIES = [
  { id: 1, name: 'Гоблин', baseHp: 20, baseDamage: 2, critChance: 2, exp: 1, goldMin: 4, goldMax: 5 },
  { id: 2, name: 'Скелет', baseHp: 30, baseDamage: 3, critChance: 3, exp: 2, goldMin: 5, goldMax: 8 },
  { id: 3, name: 'Орк', baseHp: 50, baseDamage: 5, critChance: 5, exp: 4, goldMin: 6, goldMax: 7 },
  { id: 4, name: 'Тролль', baseHp: 40, baseDamage: 5, critChance: 6, exp: 3, goldMin: 5, goldMax: 9 },
  { id: 5, name: 'Дракон', baseHp: 90, baseDamage: 5, critChance: 10, exp: 5, goldMin: 15, goldMax: 15 }
];

export const useEnemy = () => {
  const INITIAL_STATE = {
    id: 0,
    name: "Рошан",
    enemyHp: 50,
    maxHp: 50,
    enemyDamage: 1,
    critChance: 5 // %
  };

  const [enemy, setEnemy] = useState(INITIAL_STATE);

  const setFromTemplate = (template, heroLevel = 1) => {
    // HP scaling
    const hpMultiplier = Math.max(1, (1 + (heroLevel - 1) * ENEMY_HP_LEVEL_MULT));
    const scaledHp = Math.max(1, Math.round(template.baseHp * hpMultiplier));

    // Damage scaling
    const dmgMultiplier = Math.max(1, (1 + (heroLevel - 1) * ENEMY_DMG_LEVEL_MULT));
    const scaledDmg = Math.max(1, Math.round(template.baseDamage * dmgMultiplier));

    // Crit chance scaling (scale relative to base crit)
    const scaledCrit = Math.min(
      100,
      Math.max(0, Math.round((template.critChance || 0) * (1 + (heroLevel - 1) * ENEMY_CRIT_LEVEL_MULT)))
    );

    // Gold drop scaling
    const goldMultiplier = Math.max(1, (1 + (heroLevel - 1) * ENEMY_GOLD_SCALE_FACTOR));
    const scaledGoldMin = Math.max(0, Math.round((template.goldMin || 0) * goldMultiplier));
    const scaledGoldMax = Math.max(scaledGoldMin, Math.round((template.goldMax || 0) * goldMultiplier));

    setEnemy({
      id: template.id,
      name: template.name,
      enemyHp: scaledHp,
      maxHp: scaledHp,
      enemyDamage: scaledDmg,
      critChance: scaledCrit,
      exp: template.exp || 0,
      goldMin: scaledGoldMin,
      goldMax: scaledGoldMax
    });
  };

  const spawnRandomEnemy = (heroLevel = 1) => {
    const idx = Math.floor(Math.random() * ENEMIES.length);
    const template = ENEMIES[idx];
    setFromTemplate(template, heroLevel);
  };

  const takeDamage = (amount) => {
    setEnemy(prev => ({ ...prev, enemyHp: Math.max(0, prev.enemyHp - amount) }));
  };

  const dealDamage = () => {
    if (enemy.enemyHp <= 0) return { damage: 0, isCrit: false };
    const rand = Math.random() * 100;
    const isCrit = rand < (enemy.critChance || 0);
    const dmg = isCrit ? Math.round(enemy.enemyDamage * (ENEMY_CRIT_MULT || 1.5)) : enemy.enemyDamage;
    return { damage: dmg, isCrit };
  };

  const increaseDamage = (amount) => {
    setEnemy(prev => ({ ...prev, enemyDamage: prev.enemyDamage + amount }));
  };

  const increaseCritChance = (amountPercent) => {
    setEnemy(prev => ({ ...prev, critChance: Math.min(100, (prev.critChance || 0) + amountPercent) }));
  };

  const resetEnemy = () => {
    // spawn base enemy (level 1)
    spawnRandomEnemy(1);
  };

  return { enemy, takeDamage, dealDamage, increaseDamage, increaseCritChance, resetEnemy, spawnRandomEnemy };
};
