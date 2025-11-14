import React from 'react';
import { Copy, RotateCcw } from 'lucide-react';

const ResultCard = ({ 
  decision, 
  reason, 
  explanation,
  confidence = 'high',
  showActions = true,
  onNewHand,
  onCopy,
  animated = true
}) => {
  // Determine color scheme based on decision
  const getColorScheme = () => {
    const decisionUpper = decision?.toUpperCase() || '';
    
    if (decisionUpper.includes('RAISE') || decisionUpper.includes('SPLIT') || decisionUpper.includes('HOLD')) {
      return {
        bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
        border: 'border-emerald-400',
        text: 'text-white',
        icon: '✓'
      };
    }
    
    if (decisionUpper.includes('FOLD') || decisionUpper.includes('DISCARD')) {
      return {
        bg: 'bg-gradient-to-br from-red-500 to-red-600',
        border: 'border-red-400',
        text: 'text-white',
        icon: '✗'
      };
    }
    
    // Default (blue for blackjack, etc.)
    return {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      border: 'border-blue-400',
      text: 'text-white',
      icon: '→'
    };
  };

  const colors = getColorScheme();

  return (
    <div
      className={`
        ${colors.bg}
        ${colors.border}
        border-[3px]
        rounded-xl
        p-6
        shadow-2xl
        ${animated ? 'animate-fadeInUp' : ''}
      `}
    >
      <div className="text-center">
        {/* Decision */}
        <div className={`${colors.text} text-4xl md:text-5xl font-black mb-4 tracking-wider`}>
          <span className="mr-2">{colors.icon}</span>
          {decision}
        </div>

        {/* Divider */}
        <div className={`h-px ${colors.border} bg-opacity-50 my-4`}></div>

        {/* Reason */}
        <div className={`${colors.text} text-lg md:text-xl mb-2 font-semibold`}>
          {reason}
        </div>

        {/* Explanation (if provided) */}
        {explanation && (
          <div className={`${colors.text} text-sm md:text-base mt-3 opacity-90`}>
            💡 {explanation}
          </div>
        )}

        {/* Confidence indicator */}
        {confidence && (
          <div className={`${colors.text} text-xs mt-3 opacity-75`}>
            {confidence === 'high' && '✓ High confidence'}
            {confidence === 'medium' && '⚠ Medium confidence'}
            {confidence === 'low' && '? Low confidence'}
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="flex gap-3 justify-center mt-6">
            {onNewHand && (
              <button
                onClick={onNewHand}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Hand
              </button>
            )}
            {onCopy && (
              <button
                onClick={onCopy}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Result
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;

