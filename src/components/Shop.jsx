import React from 'react';

const CATEGORY_NAMES = {
  attack: 'Атака',
  hp: 'Здоровье',
  gold: 'Золото',
  stamina: 'Выносливость',
  defense: 'Защита',
  ultra: 'Особые',
  misc: 'Остальное'
};

const Shop = ({ upgrades, onBuy, currentGold, isGameOver }) => {
  // Группируем предметы по категориям в порядке первого появления
  const groups = {};
  const order = [];
  upgrades.forEach(item => {
    const cat = item.categoryId || 'misc';
    if (!groups[cat]) {
      groups[cat] = [];
      order.push(cat);
    }
    groups[cat].push(item);
  });

  // Поместим категории в порядке: все остальные -> ultra -> misc (если они есть)
  const hasUltra = order.indexOf('ultra') !== -1;
  const hasMisc = order.indexOf('misc') !== -1;
  const ordered = order.filter(c => c !== 'ultra' && c !== 'misc');
  if (hasUltra) ordered.push('ultra');
  if (hasMisc) ordered.push('misc');

  return (
    <div className="shop">
      <h3>🛒 Потайная лавка</h3>
      {ordered.map(cat => (
        <div key={cat} className="shop-category">
          <h4 className={`shop-category-title shop-cat-${cat}`}>{CATEGORY_NAMES[cat] || cat}</h4>
          <div className="shop-row">
            {groups[cat].map(item => (
              <div key={item.id} className="shop-item">
                <div className="shop-icon">{item.icon}</div>
                <div className="shop-info">
                  <label><b>{item.name}</b></label>
                  <div className="shop-cost"></div>
                  <div className="shop-bonuses">
                    {item.dmgBonus > 0 && <div className="shop-bonus">+{item.dmgBonus} ДМГ</div>}
                    {item.hpBonus > 0 && <div className="shop-bonus">+{item.hpBonus} ХП</div>}
                    {item.goldPerAttackBonus > 0 && <div className="shop-bonus">+{item.goldPerAttackBonus} ЗЛТ/атака</div>}
                    {item.permanentHpBonus > 0 && <div className="shop-bonus">+{item.permanentHpBonus} макс. ХП</div>}
                    {item.permanentStaminaBonus > 0 && <div className="shop-bonus">+{item.permanentStaminaBonus} макс. ЭНГ</div>}
                    {item.critChanceBonus > 0 && <div className="shop-bonus">+{item.critChanceBonus}% шанс крита</div>}
                    {(!item.dmgBonus && !item.hpBonus && !item.goldPerAttackBonus && !item.permanentHpBonus && !item.permanentStaminaBonus && !item.critChanceBonus) && <div className="shop-bonus">Нет бонусов</div>}
                  </div>
                </div>
                <button
                  className="btn buy-btn"
                  disabled={isGameOver || currentGold < item.cost}
                  onClick={() => onBuy(item)}
                >
                  {item.cost}💰
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shop;
