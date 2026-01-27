import React from 'react';

const Controls = ({ onAttack, onRest, onBuyCharge, isGameOver, energy, restCharges, maxRestCharges, restChargeCost }) => (
  <div className="controls">
    <button 
      className="btn attack-btn" 
      onClick={onAttack} 
      disabled={isGameOver || energy === 0}
    >
      ⚔️ Атаковать
    </button>
    <div style={{display: 'inline-block', marginLeft: '10px'}}>
      <button 
        className="btn rest-btn" 
        onClick={onRest} 
        disabled={isGameOver || restCharges <= 0}
      >
        ⛺ Отдохнуть ({restCharges}/{maxRestCharges})
      </button>
      <button
        className="btn buy-charge-btn"
        onClick={onBuyCharge}
        disabled={isGameOver}
        style={{marginLeft: '8px'}}
      >
        💳 Купить заряд ({restChargeCost} HP)
      </button>
    </div>
  </div>
);

export default Controls;
