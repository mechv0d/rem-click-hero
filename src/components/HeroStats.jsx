import React from 'react';
import { BASE_EXP, EXP_GROWTH_FACTOR } from '../config';

const HeroStats = ({ hero }) => {
  const expRequired = Math.max(1, Math.ceil(BASE_EXP * Math.pow(EXP_GROWTH_FACTOR, (hero.level || 1) - 1)));
  const expPercent = Math.min(100, Math.round(((hero.exp || 0) / expRequired) * 100));

  return (
    <div className="card hero-card">
      <h3>Герой LVL {hero.level}</h3>
      <div className="stat-row">EXP: <b>{hero.exp || 0}</b> / {expRequired}</div>
      <div className="progress-bar">
        <div style={{width: `${expPercent}%`, background: '#3498db'}}></div>
      </div>

      <div className="stat-row">❤️ Здоровье: <b>{hero.heroHp}</b> / {hero.maxHp}</div>
      <div className="progress-bar">
        <div style={{width: `${(hero.heroHp/hero.maxHp)*100}%`, background: '#e74c3c'}}></div>
      </div>
      
      <div className="stat-row">⚡ Энергия: <b>{hero.energy}</b> / {hero.maxEnergy}</div>
      <div className="progress-bar">
        <div style={{width: `${(hero.energy/hero.maxEnergy)*100}%`, background: '#f1c40f'}}></div>
      </div>
      
      <div className="stat-row">💰 Золото: <span className="gold"><b>{hero.gold}</b></span></div>
      <div className="stat-row">🪙 Золото/атака: <b>{hero.goldPerAttack}</b></div>
      <div className="stat-row">🎯 Шанс крита: <b>{hero.critChance}%</b></div>
      <div className="stat-row">⚔️ Урон: <b>{hero.powerPerClick}</b></div>
    </div>
  );
};

export default HeroStats;
