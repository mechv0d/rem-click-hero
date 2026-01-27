import React from 'react';

const EnemyStats = ({ enemy }) => (
  <div className="card enemy-card">
    <h3>👾 {enemy.name}</h3>
    <div className="stat-row">❤️ Здоровье: <b>{enemy.enemyHp}</b> / {enemy.maxHp}</div>
    <div className="progress-bar">
      <div style={{width: `${(enemy.enemyHp/enemy.maxHp)*100}%`, background: '#8e44ad'}}></div>
    </div>
    <div className="stat-row">🔪 Атака врага: <b>{enemy.enemyDamage}</b></div>
    <div className="stat-row">🎯 Шанс крита: <b>{enemy.critChance}%</b></div>
  </div>
);

export default EnemyStats;
