import React from 'react';
import PlayingCard from './PlayingCard';

const SelectedCards = ({ 
  cards = [], 
  maxCards = 5, 
  onRemoveCard,
  showEmptySlots = true,
  holdIndices = [] // For video poker: which cards to hold
}) => {
  const slots = Array(maxCards).fill(null).map((_, index) => {
    return cards[index] || null;
  });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {slots.map((card, index) => (
          <div key={index} className="relative">
            {card ? (
              <PlayingCard
                rank={card.rank}
                suit={card.suit}
                size="large"
                selected={true}
                onRemove={() => onRemoveCard && onRemoveCard(index)}
                showHoldIndicator={holdIndices.includes(index + 1)}
              />
            ) : showEmptySlots ? (
              <PlayingCard
                size="large"
                disabled={true}
              />
            ) : null}
          </div>
        ))}
      </div>
      
      {cards.length > 0 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {cards.length < maxCards ? (
            <span>Select {maxCards - cards.length} more card{maxCards - cards.length !== 1 ? 's' : ''}</span>
          ) : (
            <span className="text-green-600 font-semibold">Hand complete!</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedCards;

