import React from 'react';

const EnemyStats = ({ enemy, searchingNew }) => {
  if (searchingNew) {
    return (
      <div className="card enemy-card">
        <h3>👾 {enemy.name}</h3>
        <div className="stat-row">Враг повержен. Идёт поиск нового...</div>
      </div>
    );
  }

  return (
    <div className="card enemy-card">
      <h3>👾 {enemy.name}</h3>
      <div className="stat-row">❤️ Здоровье: <b>{enemy.enemyHp}</b> / {enemy.maxHp}</div>
      <div className="progress-bar">
        <div style={{width: `${(enemy.enemyHp/enemy.maxHp)*100}%`, background: '#8e44ad'}}></div>
      </div>
      <div className="stat-row">🔪 Атака врага: <b>{enemy.enemyDamage}</b></div>
      <div className="stat-row">🎯 Шанс крита: <b>{enemy.critChance}%</b></div>
      <div className="stat-row">
        💰 Дроп золота: <b>{enemy.goldMin === enemy.goldMax ? enemy.goldMin : `${enemy.goldMin} - ${enemy.goldMax}`}</b>
      </div>
    </div>
  );
};

export default EnemyStats;
