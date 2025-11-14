import React, { useState, useEffect, useRef } from 'react';
import PlayingCard from './PlayingCard';

const CardGrid = ({ 
  selectedCards = [], 
  maxCards = 5, 
  onCardSelect,
  disabledCards = [],
  className = ''
}) => {
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits = ['♠', '♥', '♦', '♣'];
  const [keyboardInput, setKeyboardInput] = useState('');
  const inputTimeoutRef = useRef(null);

  // Generate all 52 cards
  const allCards = suits.flatMap(suit => 
    ranks.map(rank => ({ rank, suit }))
  );

  const isCardSelected = (card) => {
    return selectedCards.some(
      selected => selected.rank === card.rank && selected.suit === card.suit
    );
  };

  const isCardDisabled = (card) => {
    // Disable if already selected
    if (isCardSelected(card)) return true;
    // Disable if max cards reached and this card isn't selected
    if (selectedCards.length >= maxCards && !isCardSelected(card)) return true;
    // Disable if in disabledCards array
    return disabledCards.some(
      disabled => disabled.rank === card.rank && disabled.suit === card.suit
    );
  };

  const handleCardClick = (card) => {
    if (isCardDisabled(card)) return;

    if (isCardSelected(card)) {
      // Deselect
      const newSelection = selectedCards.filter(
        c => !(c.rank === card.rank && c.suit === card.suit)
      );
      onCardSelect(newSelection);
    } else {
      // Select (if under max)
      if (selectedCards.length < maxCards) {
        onCardSelect([...selectedCards, card]);
      }
    }
  };

  // Keyboard input handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle if typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Escape clears selection
      if (e.key === 'Escape') {
        onCardSelect([]);
        setKeyboardInput('');
        return;
      }

      // Backspace removes last card
      if (e.key === 'Backspace' && selectedCards.length > 0) {
        const newSelection = [...selectedCards];
        newSelection.pop();
        onCardSelect(newSelection);
        setKeyboardInput('');
        return;
      }

      // Enter submits (if max cards reached)
      if (e.key === 'Enter' && selectedCards.length === maxCards) {
        // Could trigger auto-calculate here if needed
        return;
      }

      // Space confirms current input
      if (e.key === ' ' && keyboardInput.length >= 2) {
        e.preventDefault();
        parseKeyboardInput(keyboardInput);
        setKeyboardInput('');
        return;
      }

      // Build input string (rank + suit)
      if (/^[A-Z0-9]$/i.test(e.key)) {
        const newInput = keyboardInput + e.key.toUpperCase();
        setKeyboardInput(newInput);

        // Clear timeout
        if (inputTimeoutRef.current) {
          clearTimeout(inputTimeoutRef.current);
        }

        // Auto-submit if we have rank + suit
        if (newInput.length >= 2) {
          inputTimeoutRef.current = setTimeout(() => {
            parseKeyboardInput(newInput);
            setKeyboardInput('');
          }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }
    };
  }, [keyboardInput, selectedCards, maxCards, onCardSelect]);

  const parseKeyboardInput = (input) => {
    if (input.length < 2) return;

    // Parse rank (first char or first 2 chars for 10)
    let rank = input[0];
    let suitChar = input[1];

    // Handle "10" as rank
    if (input.length >= 3 && input[0] === '1' && input[1] === '0') {
      rank = '10';
      suitChar = input[2];
    }

    // Map suit character to suit symbol
    const suitMap = {
      'S': '♠',
      'H': '♥',
      'D': '♦',
      'C': '♣'
    };

    const suit = suitMap[suitChar];
    if (!suit) return;

    // Validate rank
    const validRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    if (!validRanks.includes(rank)) return;

    const card = { rank, suit };

    // Toggle selection
    if (isCardSelected(card)) {
      handleCardClick(card);
    } else if (selectedCards.length < maxCards) {
      handleCardClick(card);
    }
  };

  return (
    <div className={className}>
      {/* Keyboard input indicator (optional, can be hidden) */}
      {keyboardInput && (
        <div className="mb-2 text-sm text-yellow-300 font-mono">
          Input: {keyboardInput}
        </div>
      )}

      {/* Desktop: Full grid */}
      <div className="hidden md:block">
        <div className="space-y-4">
          {suits.map((suit, suitIdx) => (
            <div key={suit} className="flex items-center gap-2">
              <div className="w-16 text-sm font-semibold text-white flex-shrink-0">
                {suit === '♠' && 'Spades:'}
                {suit === '♥' && 'Hearts:'}
                {suit === '♦' && 'Diamonds:'}
                {suit === '♣' && 'Clubs:'}
              </div>
              <div className="flex gap-2 flex-wrap">
                {ranks.map(rank => {
                  const card = { rank, suit };
                  return (
                    <PlayingCard
                      key={`${rank}${suit}`}
                      rank={rank}
                      suit={suit}
                      size="small"
                      selected={isCardSelected(card)}
                      disabled={isCardDisabled(card)}
                      onClick={() => handleCardClick(card)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Horizontal scrollable rows */}
      <div className="md:hidden space-y-3">
        {suits.map((suit) => (
          <div key={suit} className="flex items-center gap-2">
            <div className="w-12 text-xs font-semibold text-white flex-shrink-0">
              {suit}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
              {ranks.map(rank => {
                const card = { rank, suit };
                return (
                  <div key={`${rank}${suit}`} className="flex-shrink-0">
                    <PlayingCard
                      rank={rank}
                      suit={suit}
                      size="small"
                      selected={isCardSelected(card)}
                      disabled={isCardDisabled(card)}
                      onClick={() => handleCardClick(card)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGrid;

