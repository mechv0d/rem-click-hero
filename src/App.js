import React from 'react';
import './App.css';
import { useLogic } from './hooks/useLogic';
import HeroStats from './components/HeroStats';
import EnemyStats from './components/EnemyStats';
import Controls from './components/Controls';
import Shop from './components/Shop';

// Константы можно хранить здесь или в отдельном файле
const UPGRADES = [
  { id: 1, name: 'Дезолятор', cost: 5, dmgBonus: 2, hpBonus: 1, goldPerAttackBonus: 1, permanentHpBonus: 1, permanentStaminaBonus: 1, critChanceBonus: 1, categoryId: 'attack', icon: '🗡️' },
  { id: 4, name: 'Фласка', cost: 5, dmgBonus: 0, hpBonus: 15, goldPerAttackBonus: 0, permanentHpBonus: 1, permanentStaminaBonus: 0, critChanceBonus: 0, categoryId: 'hp', icon: '🩹' },
  { id: 2, name: 'Дейдалус', cost: 25, dmgBonus: 5, hpBonus: 0, goldPerAttackBonus: 0, permanentHpBonus: 0, permanentStaminaBonus: 2, critChanceBonus: 10, categoryId: 'attack', icon: '🪓' },
  { id: 3, name: 'Аганим', cost: 50, dmgBonus: 5, hpBonus: 5, goldPerAttackBonus: 5, permanentHpBonus: 5, permanentStaminaBonus: 5, critChanceBonus: 2, categoryId: 'ultra', icon: '💎' },
  { id: 5, name: 'Философский камень', cost: 25, dmgBonus: 0, hpBonus: 0, goldPerAttackBonus: 5, permanentHpBonus: 5, permanentStaminaBonus: 0, critChanceBonus: 0, categoryId: 'gold', icon: '🪙' },
  { id: 6, name: 'Кираса', cost: 30, dmgBonus: 2, hpBonus: 0, goldPerAttackBonus: 0, permanentHpBonus: 15, permanentStaminaBonus: 5, critChanceBonus: 3, categoryId: 'defense', icon: '💍' },
  { id: 7, name: 'Тараска', cost: 45, dmgBonus: 1, hpBonus: 5, goldPerAttackBonus: 0, permanentHpBonus: 40, permanentStaminaBonus: 0, critChanceBonus: 1, categoryId: 'defense', icon: '🛡️' },
  { id: 8, name: 'Башер', cost: 38, dmgBonus: 10, hpBonus: 0, goldPerAttackBonus: 5, permanentHpBonus: 0, permanentStaminaBonus: 0, critChanceBonus: 10, categoryId: 'attack', icon: '🔨' },
  { id: 9, name: 'Б.К.Б.', cost: 50, dmgBonus: 5, hpBonus: 0, goldPerAttackBonus: 1, permanentHpBonus: 20, permanentStaminaBonus: 20, critChanceBonus: 0, categoryId: 'ultra', icon: '📿' }
];

function App() {
  const { hero, enemy, gameState, actions } = useLogic();

  return (
    <>
    <div className={`app-container ${gameState.isGameOver ? 'game-over-bg' : ''}`}>
      <h1 className="game-title">🎮 Click Hero</h1>
      
      <div className={`status-message ${gameState.statusType}`}>
        {gameState.statusMessage}
      </div>

      <div className="battle-arena">
        <HeroStats hero={hero} />
        <div className="vs">VS</div>
        <EnemyStats enemy={enemy} />
      </div>

      <Controls 
        onAttack={actions.attack} 
        onRest={actions.rest}
        onBuyCharge={actions.buyCharge}
        isGameOver={gameState.isGameOver}
        energy={hero.energy}
        restCharges={hero.restCharges}
        maxRestCharges={hero.maxRestCharges}
        restChargeCost={Math.max(3, Math.floor(hero.maxHp * (hero.restChargeCostPercent || 0.1)))}
      />

      {gameState.isGameOver && (
        <button className="btn restart-btn" onClick={actions.restart}>
          🔁 Начать заново
        </button>
      )}

      <hr className="divider"/>
    </div>
    {/* Магазин отдельной широкоформатной строкой */}
    <div className="shop-fullwidth">
      <Shop 
        upgrades={UPGRADES} 
        onBuy={actions.buy} 
        currentGold={hero.gold}
        isGameOver={gameState.isGameOver}
      />
    </div>
    </>
  );
}

export default App;
