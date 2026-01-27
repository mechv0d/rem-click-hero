import React from 'react';

const HeroStats = ({ hero }) => (
  <div className="card hero-card">
    <h3>Герой</h3>
    <div className="stat-row">❤️ Здоровье: <b>{hero.heroHp}</b> / {hero.maxHp}</div>
    <div className="progress-bar">
      <div style={{width: `${(hero.heroHp/hero.maxHp)*100}%`, background: '#e74c3c'}}></div>
    </div>
    
    <div className="stat-row">⚡ Энергия: <b>{hero.energy}</b> / {hero.maxEnergy}</div>
    <div className="progress-bar">
      <div style={{width: `${(hero.energy/hero.maxEnergy)*100}%`, background: '#f1c40f'}}></div>
    </div>
    
    <div className="stat-row">💰 Золото: <b>{hero.gold}</b></div>
    <div className="stat-row">🪙 Золото/атака: <b>{hero.goldPerAttack}</b></div>
    <div className="stat-row">🎯 Шанс крита: <b>{hero.critChance}%</b></div>
    <div className="stat-row">⚔️ Урон: <b>{hero.powerPerClick}</b></div>
  </div>
);

export default HeroStats;
