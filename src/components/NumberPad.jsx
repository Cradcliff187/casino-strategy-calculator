import React from 'react';

const NumberPad = ({ value, onChange, onClear }) => {
  const commonTotals = [4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 21];

  const handleNumberClick = (num) => {
    onChange(num.toString());
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '' || (parseInt(val) >= 4 && parseInt(val) <= 21)) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Hand Total
        </label>
        <input
          type="number"
          min="4"
          max="21"
          value={value}
          onChange={handleInputChange}
          placeholder="Enter total (4-21)"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-center text-2xl font-bold"
        />
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">Quick Select:</div>
        <div className="grid grid-cols-5 gap-2">
          {commonTotals.map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={`
                h-16
                rounded-xl
                font-bold
                text-lg
                transition-all
                duration-200
                ${value === num.toString()
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-green-900 shadow-lg scale-105'
                  : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 hover:shadow-md hover:scale-105'
                }
                active:scale-95
              `}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={() => handleNumberClick(21)}
            className={`
              h-16
              rounded-xl
              font-bold
              text-lg
              transition-all
              duration-200
              ${value === '21'
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-green-900 shadow-lg scale-105'
                : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 hover:shadow-md hover:scale-105'
              }
              active:scale-95
            `}
          >
            21
          </button>
          <button
            onClick={() => handleNumberClick('BJ')}
            className={`
              h-16
              rounded-xl
              font-bold
              text-lg
              transition-all
              duration-200
              ${value === 'BJ'
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-green-900 shadow-lg scale-105'
                : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500 hover:shadow-md hover:scale-105'
              }
              active:scale-95
            `}
          >
            BJ
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="h-16 rounded-xl font-bold text-lg bg-gray-400 hover:bg-gray-500 text-white transition-all duration-200 hover:shadow-md active:scale-95"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberPad;

