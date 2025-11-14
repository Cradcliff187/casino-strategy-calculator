import React from 'react';
import { X } from 'lucide-react';

const PlayingCard = ({ 
  rank, 
  suit, 
  size = 'medium', 
  selected = false, 
  disabled = false, 
  onClick,
  showHoldIndicator = false,
  onRemove,
  className = ''
}) => {
  const isRed = suit === '♥' || suit === '♦';
  const suitColor = isRed ? '#DC2626' : '#1F2937';

  // Size mappings
  const sizeClasses = {
    small: 'w-[50px] h-[70px] text-xs',
    medium: 'w-[60px] h-[80px] text-sm',
    large: 'w-[80px] h-[110px] text-base'
  };

  const rankSizeClasses = {
    small: 'text-[14px]',
    medium: 'text-[18px]',
    large: 'text-[22px]'
  };

  const suitSizeClasses = {
    small: 'text-[24px]',
    medium: 'text-[32px]',
    large: 'text-[40px]'
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative
        ${sizeClasses[size]}
        bg-white
        rounded-lg
        shadow-md
        transition-all
        duration-200
        ease-in-out
        ${selected ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110 shadow-2xl' : ''}
        ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:rotate-2 hover:shadow-xl'}
        ${onClick && !disabled ? '' : ''}
        ${className}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={rank && suit ? `${rank} of ${suit === '♥' ? 'Hearts' : suit === '♦' ? 'Diamonds' : suit === '♠' ? 'Spades' : 'Clubs'}` : 'Empty card slot'}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {/* Remove button (for selected cards display) */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110"
          aria-label="Remove card"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Hold indicator (for video poker results) */}
      {showHoldIndicator && (
        <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold z-10">
          HOLD
        </div>
      )}

      {/* Card content */}
      {rank && suit ? (
        <>
          {/* Top-left rank */}
          <div 
            className={`absolute top-1 left-1.5 font-bold ${rankSizeClasses[size]}`}
            style={{ color: suitColor }}
          >
            {rank}
          </div>

          {/* Center suit */}
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${suitSizeClasses[size]}`}
            style={{ color: suitColor }}
          >
            {suit}
          </div>

          {/* Bottom-right rank (upside down) */}
          <div 
            className={`absolute bottom-1 right-1.5 font-bold transform rotate-180 ${rankSizeClasses[size]}`}
            style={{ color: suitColor }}
          >
            {rank}
          </div>
        </>
      ) : (
        // Empty slot
        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">Empty</span>
        </div>
      )}
    </div>
  );
};

export default PlayingCard;

