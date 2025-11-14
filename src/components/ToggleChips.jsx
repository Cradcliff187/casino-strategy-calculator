import React from 'react';

const ToggleChips = ({ isSoft, isPair, onSoftToggle, onPairToggle }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onSoftToggle}
        className={`
          relative
          px-6
          py-3
          rounded-full
          font-semibold
          transition-all
          duration-200
          min-h-[44px]
          ${isSoft
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-4 ring-blue-300 ring-opacity-50'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }
          active:scale-95
        `}
        aria-pressed={isSoft}
        aria-label="Soft Hand toggle"
      >
        <span className="relative z-10">Soft Hand</span>
        {isSoft && (
          <span className="absolute inset-0 bg-white bg-opacity-20 rounded-full"></span>
        )}
      </button>

      <button
        onClick={onPairToggle}
        className={`
          relative
          px-6
          py-3
          rounded-full
          font-semibold
          transition-all
          duration-200
          min-h-[44px]
          ${isPair
            ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg ring-4 ring-purple-300 ring-opacity-50'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }
          active:scale-95
        `}
        aria-pressed={isPair}
        aria-label="Pair toggle"
      >
        <span className="relative z-10">Pair</span>
        {isPair && (
          <span className="absolute inset-0 bg-white bg-opacity-20 rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default ToggleChips;

