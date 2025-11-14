import React from 'react';

const DealerCardButtons = ({ selectedCard, onSelect }) => {
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Dealer's Upcard
      </label>
      <div className="flex gap-2 flex-wrap">
        {cards.map(card => (
          <button
            key={card}
            onClick={() => onSelect(card)}
            className={`
              w-12
              h-12
              rounded-lg
              font-bold
              text-lg
              transition-all
              duration-200
              ${selectedCard === card
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-green-900 ring-4 ring-yellow-300 ring-opacity-75 shadow-lg scale-110'
                : 'bg-white text-gray-800 hover:bg-gray-100 hover:scale-105 shadow-md'
              }
              active:scale-95
            `}
            aria-label={`Dealer card: ${card}`}
            aria-pressed={selectedCard === card}
          >
            {card}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DealerCardButtons;

