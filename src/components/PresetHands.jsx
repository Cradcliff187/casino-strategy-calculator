import React from 'react';

const PresetHands = ({ gameType, onSelectPreset }) => {
  const presets = {
    '3card': [
      { name: 'Q-6-4', cards: [{ rank: 'Q', suit: '♥' }, { rank: '6', suit: '♠' }, { rank: '4', suit: '♦' }] },
      { name: 'Q-5-3', cards: [{ rank: 'Q', suit: '♥' }, { rank: '5', suit: '♠' }, { rank: '3', suit: '♦' }] },
      { name: 'Pair 8s', cards: [{ rank: '8', suit: '♥' }, { rank: '8', suit: '♠' }, { rank: 'K', suit: '♦' }] },
      { name: 'K-high', cards: [{ rank: 'K', suit: '♥' }, { rank: '7', suit: '♠' }, { rank: '2', suit: '♦' }] },
      { name: 'Flush', cards: [{ rank: 'A', suit: '♥' }, { rank: 'K', suit: '♥' }, { rank: 'Q', suit: '♥' }] }
    ],
    'videopoker': [
      { name: 'Royal', cards: [{ rank: 'A', suit: '♥' }, { rank: 'K', suit: '♥' }, { rank: 'Q', suit: '♥' }, { rank: 'J', suit: '♥' }, { rank: '10', suit: '♥' }] },
      { name: 'Pair Js', cards: [{ rank: 'J', suit: '♥' }, { rank: 'J', suit: '♠' }, { rank: '3', suit: '♦' }, { rank: '7', suit: '♣' }, { rank: '9', suit: '♥' }] },
      { name: '4 Flush', cards: [{ rank: 'A', suit: '♥' }, { rank: 'K', suit: '♥' }, { rank: 'Q', suit: '♥' }, { rank: 'J', suit: '♥' }, { rank: '3', suit: '♠' }] },
      { name: 'Nothing', cards: [{ rank: '2', suit: '♥' }, { rank: '5', suit: '♠' }, { rank: '8', suit: '♦' }, { rank: 'J', suit: '♣' }, { rank: 'K', suit: '♠' }] }
    ]
  };

  const gamePresets = presets[gameType] || [];

  if (gamePresets.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Quick Test Hands:</div>
      <div className="flex gap-2 flex-wrap">
        {gamePresets.map((preset, index) => (
          <button
            key={index}
            onClick={() => onSelectPreset(preset.cards)}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 border border-yellow-400 rounded-lg text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetHands;

