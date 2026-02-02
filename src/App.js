import React from 'react';
import './App.css';
import { PRICE_DEFAULT_BOUGHT_MULT } from './config';
import { useLogic } from './hooks/useLogic';
import HeroStats from './components/HeroStats';
import EnemyStats from './components/EnemyStats';
import Controls from './components/Controls';
import Shop from './components/Shop';

// Константы можно хранить здесь или в отдельном файле
const UPGRADES = [
  { id: 1, name: 'Дезолятор', cost: 10, dmgBonus: 1, hpBonus: 1, goldPerAttackBonus: 0.25, permanentHpBonus: 0, permanentStaminaBonus: 1, critChanceBonus: 0, categoryId: 'attack', icon: '🗡️', priceMultOnBoughtQuantity: PRICE_DEFAULT_BOUGHT_MULT },
  { id: 4, name: 'Фласка', cost: 10, dmgBonus: 0, hpBonus: 20, goldPerAttackBonus: 0, permanentHpBonus: 0, permanentStaminaBonus: 0, critChanceBonus: 0, categoryId: 'hp', icon: '🩹', priceMultOnBoughtQuantity: 1.1 },
  { id: 2, name: 'Дейдалус', cost: 20, dmgBonus: 5, hpBonus: 0, goldPerAttackBonus: 0, permanentHpBonus: 0, permanentStaminaBonus: 3, critChanceBonus: 3, categoryId: 'attack', icon: '🪓', priceMultOnBoughtQuantity: PRICE_DEFAULT_BOUGHT_MULT },
  { id: 3, name: 'Аганим', cost: 100, dmgBonus: 15, hpBonus: 5, goldPerAttackBonus: 5, permanentHpBonus: 15, permanentStaminaBonus: 10, critChanceBonus: 5 , categoryId: 'ultra', icon: '💎', priceMultOnBoughtQuantity: PRICE_DEFAULT_BOUGHT_MULT },
  { id: 5, name: 'Философский камень', cost: 20, dmgBonus: 0, hpBonus: 0, goldPerAttackBonus: 3, permanentHpBonus: 3, permanentStaminaBonus: 0, critChanceBonus: 0, categoryId: 'gold', icon: '🪙', priceMultOnBoughtQuantity: 2.2 },
  { id: 6, name: 'Кираса', cost: 20, dmgBonus: 2, hpBonus: 0, goldPerAttackBonus: 0, permanentHpBonus: 15, permanentStaminaBonus: 5, critChanceBonus: .5, categoryId: 'defense', icon: '💍', priceMultOnBoughtQuantity: PRICE_DEFAULT_BOUGHT_MULT },
  { id: 7, name: 'Тараска', cost: 50, dmgBonus: 1, hpBonus: 5, goldPerAttackBonus: 0, permanentHpBonus: 40, permanentStaminaBonus: 0, critChanceBonus: .1, categoryId: 'defense', icon: '🛡️', priceMultOnBoughtQuantity: PRICE_DEFAULT_BOUGHT_MULT },
  { id: 8, name: 'Башер', cost: 25, dmgBonus: 10, hpBonus: 0, goldPerAttackBonus: 2.5, permanentHpBonus: 0, permanentStaminaBonus: 0, critChanceBonus: 1, categoryId: 'attack', icon: '🔨', priceMultOnBoughtQuantity: PRICE_DEFAULT_BOUGHT_MULT },
  { id: 9, name: 'Б.К.Б', cost: 40, dmgBonus: 3, hpBonus: 0, goldPerAttackBonus: 1, permanentHpBonus: 10, permanentStaminaBonus: 20, critChanceBonus: 0, categoryId: 'ultra', icon: '📿', priceMultOnBoughtQuantity: PRICE_DEFAULT_BOUGHT_MULT }
];

function App() {
  const { hero, enemy, isSearchingNewEnemy, gameState, actions } = useLogic();

  return (
    <>
    {/* Статическая карточка текущей голды в правом верхнем углу */}
    <div className="gold-card" aria-hidden="true">
      <div className="gold-label">Золото</div>
      <div className="gold-amount">{hero.gold} 💰</div>
    </div>
    <div className={`app-container ${gameState.isGameOver ? 'game-over-bg' : ''}`}>
      <h1 className="game-title">🎮 Click Hero</h1>
      <h2>1ИСП-21 Рем Сергей, Жолтиков Евгений, Соколов Дмитрий, Бобрышев Пётр
      </h2>
      
      <div className={`status-message ${gameState.statusType}`}>
        {gameState.statusMessage}
      </div>

      <div className="battle-arena">
        <HeroStats hero={hero} />
        <div className="vs">VS</div>
        <EnemyStats enemy={enemy} searchingNew={isSearchingNewEnemy} />
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
        searchingNew={isSearchingNewEnemy}
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
        purchasedItems={hero.purchasedItems}
        heroLevel={hero.level}
      />
    </div>
    </>
  );
}

export default App;
