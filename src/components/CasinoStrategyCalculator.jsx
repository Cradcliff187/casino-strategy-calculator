import React, { useState, useEffect } from 'react';
import { CreditCard, Keyboard, X, History } from 'lucide-react';
import CardGrid from './CardGrid';
import SelectedCards from './SelectedCards';
import ResultCard from './ResultCard';
import NumberPad from './NumberPad';
import DealerCardButtons from './DealerCardButtons';
import ToggleChips from './ToggleChips';
import PresetHands from './PresetHands';

const CasinoStrategyCalculator = () => {
  const [activeGame, setActiveGame] = useState('3card');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // 3 Card Poker State - Changed to array of objects
  const [threeCardHand, setThreeCardHand] = useState([]);
  
  // Blackjack State
  const [playerHand, setPlayerHand] = useState('');
  const [dealerCard, setDealerCard] = useState('');
  const [isSoft, setIsSoft] = useState(false);
  const [isPair, setIsPair] = useState(false);
  
  // Video Poker State
  const [videoPokerHand, setVideoPokerHand] = useState([]);

  // Recent hands history
  const [recentHands, setRecentHands] = useState([]);

  // Load recent hands from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('casino-calculator-recent-hands');
    if (saved) {
      try {
        setRecentHands(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent hands', e);
      }
    }
  }, []);

  // Save recent hands to localStorage
  const saveRecentHand = (gameType, hand, result) => {
    const newHand = {
      gameType,
      hand,
      result,
      timestamp: Date.now()
    };
    const updated = [newHand, ...recentHands.filter(h => 
      !(h.gameType === gameType && JSON.stringify(h.hand) === JSON.stringify(hand))
    )].slice(0, 3);
    setRecentHands(updated);
    localStorage.setItem('casino-calculator-recent-hands', JSON.stringify(updated));
  };

  // 3 Card Poker Logic - Convert objects to string format for compatibility
  const get3CardDecision = () => {
    if (threeCardHand.length !== 3) return null;
    
    // Convert objects to string format for existing logic
    const cardStrings = threeCardHand.map(card => `${card.rank}${card.suit}`);
    
    // Parse cards to extract rank and suit
    const cards = cardStrings.map(card => {
      const rank = card.slice(0, -1);
      const suit = card.slice(-1);
      // Convert rank to numeric value: A=14, K=13, Q=12, J=11, numbers as-is
      const rankValue = rank === 'A' ? 14 : rank === 'K' ? 13 : rank === 'Q' ? 12 : rank === 'J' ? 11 : parseInt(rank);
      return { rank, rankValue, suit };
    });
    
    // Sort cards by rank value descending
    cards.sort((a, b) => b.rankValue - a.rankValue);
    
    // Check for pair or three of a kind
    if (cards[0].rankValue === cards[1].rankValue || cards[1].rankValue === cards[2].rankValue || cards[0].rankValue === cards[2].rankValue) {
      return { decision: 'RAISE', reason: 'You have a pair or three of a kind' };
    }
    
    // Check for flush (all same suit)
    const isFlush = cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;
    if (isFlush) {
      return { decision: 'RAISE', reason: 'You have a flush' };
    }
    
    // Check for straight (consecutive ranks)
    const sortedValues = [cards[0].rankValue, cards[1].rankValue, cards[2].rankValue].sort((a, b) => a - b);
    const isStraight = (sortedValues[1] === sortedValues[0] + 1) && (sortedValues[2] === sortedValues[1] + 1);
    // Handle A-2-3 wrap-around straight
    const isAceLowStraight = sortedValues[0] === 2 && sortedValues[1] === 3 && sortedValues[2] === 14;
    
    if (isStraight || isAceLowStraight) {
      return { decision: 'RAISE', reason: 'You have a straight' };
    }
    
    // If highest card is K or A → RAISE
    if (cards[0].rankValue >= 13) {
      return { decision: 'RAISE', reason: 'King-high or Ace-high always raises' };
    }
    
    // If highest card is Q:
    if (cards[0].rankValue === 12) {
      // If second card > 6 → RAISE
      if (cards[1].rankValue > 6) {
        return { decision: 'RAISE', reason: 'Q-6-4 or better (second card beats 6)' };
      }
      // If second card = 6 AND third card >= 4 → RAISE
      if (cards[1].rankValue === 6 && cards[2].rankValue >= 4) {
        return { decision: 'RAISE', reason: 'Q-6-4 or better (exactly Q-6-4 threshold)' };
      }
      // Otherwise → FOLD
      return { decision: 'FOLD', reason: 'Below Q-6-4 threshold' };
    }
    
    // Otherwise → FOLD
    return { decision: 'FOLD', reason: 'Below Q-6-4 threshold' };
  };

  // Blackjack Logic (unchanged)
  const getBlackjackDecision = () => {
    if (!playerHand || !dealerCard) return null;
    
    const total = parseInt(playerHand);
    // Convert dealer card to numeric value: J/Q/K = 10, A = 11, numbers as-is
    const dealer = dealerCard === 'A' ? 11 : ['K', 'Q', 'J'].includes(dealerCard) ? 10 : parseInt(dealerCard);
    
    // Pair Logic (when isPair = true)
    if (isPair) {
      const pairValue = total / 2;
      
      // Aces (11) → SPLIT
      if (pairValue === 11) {
        return { decision: 'SPLIT', reason: 'Always split Aces' };
      }
      
      // 8s → SPLIT
      if (pairValue === 8) {
        return { decision: 'SPLIT', reason: 'Always split 8s' };
      }
      
      // 10s → NO SPLIT (stand)
      if (pairValue === 10) {
        return { decision: 'NO SPLIT', reason: 'Never split 10s (you have 20!)' };
      }
      
      // 5s → NO SPLIT (double)
      if (pairValue === 5) {
        return { decision: 'NO SPLIT', reason: 'Pair of 5s: Double on 10' };
      }
      
      // 9s → SPLIT vs 2-6, 8-9; STAND vs 7, 10, A
      if (pairValue === 9) {
        if (dealer === 7 || dealer >= 10) {
          return { decision: 'STAND', reason: 'Stand with 18 vs dealer 7, 10, or A' };
        }
        return { decision: 'SPLIT', reason: 'Split 9s vs 2-6, 8-9' };
      }
      
      // 7s → SPLIT vs 2-7; HIT vs 8+
      if (pairValue === 7) {
        if (dealer <= 7) {
          return { decision: 'SPLIT', reason: 'Split 7s vs dealer 2-7' };
        }
        return { decision: 'HIT', reason: 'Hit 7s vs dealer 8+' };
      }
      
      // 6s → SPLIT vs 2-6; HIT vs 7+
      if (pairValue === 6) {
        if (dealer >= 2 && dealer <= 6) {
          return { decision: 'SPLIT', reason: 'Split 6s vs dealer 2-6' };
        }
        return { decision: 'HIT', reason: 'Hit 6s vs dealer 7+' };
      }
      
      // 4s → SPLIT vs 5-6 only; HIT otherwise
      if (pairValue === 4) {
        if (dealer === 5 || dealer === 6) {
          return { decision: 'SPLIT', reason: 'Split 4s vs dealer 5-6 only' };
        }
        return { decision: 'HIT', reason: 'Hit 4s otherwise' };
      }
      
      // 2s/3s → SPLIT vs 2-7; HIT vs 8+
      if (pairValue === 2 || pairValue === 3) {
        if (dealer >= 2 && dealer <= 7) {
          return { decision: 'SPLIT', reason: 'Split 2s/3s vs dealer 2-7' };
        }
        return { decision: 'HIT', reason: 'Hit 2s/3s vs dealer 8+' };
      }
    }
    
    // Soft Hand Logic (when isSoft = true)
    if (isSoft) {
      // 19+ → STAND
      if (total >= 19) {
        return { decision: 'STAND', reason: 'Soft 19+ always stands' };
      }
      
      // 18 → DOUBLE vs 3-6; STAND vs 2,7,8; HIT vs 9,10,A
      if (total === 18) {
        if (dealer >= 3 && dealer <= 6) {
          return { decision: 'DOUBLE (or Stand)', reason: 'Soft 18: Double vs 3-6' };
        }
        if ([2, 7, 8].includes(dealer)) {
          return { decision: 'STAND', reason: 'Soft 18 vs 2, 7, 8' };
        }
        return { decision: 'HIT', reason: 'Soft 18: Hit vs 9, 10, A' };
      }
      
      // 17 → DOUBLE vs 3-6; HIT otherwise
      if (total === 17) {
        if (dealer >= 3 && dealer <= 6) {
          return { decision: 'DOUBLE (or Hit)', reason: 'Soft 17: Double vs 3-6' };
        }
        return { decision: 'HIT', reason: 'Soft 17: Hit otherwise' };
      }
      
      // 16/15 → DOUBLE vs 4-6; HIT otherwise
      if (total === 16 || total === 15) {
        if (dealer >= 4 && dealer <= 6) {
          return { decision: 'DOUBLE (or Hit)', reason: `Soft ${total}: Double vs 4-6` };
        }
        return { decision: 'HIT', reason: `Soft ${total}: Hit otherwise` };
      }
      
      // 14/13 → DOUBLE vs 5-6; HIT otherwise
      if (total === 14 || total === 13) {
        if (dealer === 5 || dealer === 6) {
          return { decision: 'DOUBLE (or Hit)', reason: `Soft ${total}: Double vs 5-6` };
        }
        return { decision: 'HIT', reason: `Soft ${total}: Hit otherwise` };
      }
    }
    
    // Hard Hand Logic (when isSoft = false and isPair = false)
    // 17+ → STAND
    if (total >= 17) {
      return { decision: 'STAND', reason: 'Always stand on hard 17+' };
    }
    
    // 16 → SURRENDER vs 9,10,A; HIT vs 7-8; STAND vs 2-6
    if (total === 16) {
      if (dealer >= 9) {
        return { decision: 'SURRENDER (or Hit)', reason: 'Hard 16: Surrender vs 9, 10, A' };
      }
      if (dealer >= 7) {
        return { decision: 'HIT', reason: 'Hard 16: Hit vs 7-8' };
      }
      return { decision: 'STAND', reason: 'Hard 16: Stand vs 2-6' };
    }
    
    // 15 → SURRENDER vs 10; HIT vs 7+; STAND vs 2-6
    if (total === 15) {
      if (dealer === 10) {
        return { decision: 'SURRENDER (or Hit)', reason: 'Hard 15: Surrender vs 10' };
      }
      if (dealer >= 7) {
        return { decision: 'HIT', reason: 'Hard 15: Hit vs 7+' };
      }
      return { decision: 'STAND', reason: 'Hard 15: Stand vs 2-6' };
    }
    
    // 13-14 → HIT vs 7+; STAND vs 2-6
    if (total >= 13 && total <= 14) {
      if (dealer >= 7) {
        return { decision: 'HIT', reason: `Hard ${total}: Hit vs 7+` };
      }
      return { decision: 'STAND', reason: `Hard ${total}: Stand vs 2-6` };
    }
    
    // 12 → STAND vs 4-6; HIT vs 2-3, 7+
    if (total === 12) {
      if (dealer >= 4 && dealer <= 6) {
        return { decision: 'STAND', reason: 'Hard 12: Stand vs 4-6' };
      }
      return { decision: 'HIT', reason: 'Hard 12: Hit vs 2-3, 7+' };
    }
    
    // 11 → DOUBLE vs 2-10; HIT vs A
    if (total === 11) {
      if (dealer === 11) {
        return { decision: 'HIT', reason: 'Hard 11: Hit vs Ace' };
      }
      return { decision: 'DOUBLE (or Hit)', reason: 'Hard 11: Double vs 2-10' };
    }
    
    // 10 → DOUBLE vs 2-9; HIT vs 10, A
    if (total === 10) {
      if (dealer >= 10) {
        return { decision: 'HIT', reason: 'Hard 10: Hit vs 10, A' };
      }
      return { decision: 'DOUBLE (or Hit)', reason: 'Hard 10: Double vs 2-9' };
    }
    
    // 9 → DOUBLE vs 3-6; HIT otherwise
    if (total === 9) {
      if (dealer >= 3 && dealer <= 6) {
        return { decision: 'DOUBLE (or Hit)', reason: 'Hard 9: Double vs 3-6' };
      }
      return { decision: 'HIT', reason: 'Hard 9: Hit otherwise' };
    }
    
    // 8 or less → HIT
    if (total <= 8) {
      return { decision: 'HIT', reason: 'Always hit hard 8 or less' };
    }
    
    return null;
  };

  // Video Poker Logic (unchanged, but extract hold indices)
  const getVideoPokerDecision = () => {
    // Filter out incomplete cards
    const hand = videoPokerHand.filter(card => card.rank && card.suit);
    if (hand.length !== 5) return null;

    // Convert ranks to numeric values
    const getValue = (rank) => {
      const values = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11 };
      return values[rank] || parseInt(rank);
    };

    const cards = hand.map((card, index) => ({ ...card, value: getValue(card.rank), index: index + 1 }));

    // Count ranks and suits
    const rankCounts = {};
    const suitCounts = {};
    cards.forEach(card => {
      rankCounts[card.value] = (rankCounts[card.value] || 0) + 1;
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });
    
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const isFlush = Object.keys(suitCounts).length === 1;
    const sortedValues = cards.map(c => c.value).sort((a, b) => a - b);
    
    // Check for straight
    const isStraight = sortedValues.every((val, i, arr) => i === 0 || val === arr[i-1] + 1);
    // Check for A-2-3-4-5 straight (wheel)
    const isWheelStraight = sortedValues[0] === 2 && sortedValues[1] === 3 && sortedValues[2] === 4 && sortedValues[3] === 5 && sortedValues[4] === 14;
    
    // Check for royal flush (A, K, Q, J, 10 all same suit)
    const isRoyalFlush = isFlush && sortedValues[0] === 10 && sortedValues[1] === 11 && sortedValues[2] === 12 && sortedValues[3] === 13 && sortedValues[4] === 14;
    
    // Check for straight flush
    const isStraightFlush = isFlush && (isStraight || isWheelStraight);
    
    // Priority check order (from research document simplified hierarchy)
    
    // 1. Royal Flush → HOLD ALL
    if (isRoyalFlush) {
      return { decision: 'HOLD ALL', reason: '🎉 ROYAL FLUSH! Jackpot!', holdIndices: [1, 2, 3, 4, 5] };
    }
    
    // 2. Straight Flush → HOLD ALL
    if (isStraightFlush && !isRoyalFlush) {
      return { decision: 'HOLD ALL', reason: 'Straight Flush!', holdIndices: [1, 2, 3, 4, 5] };
    }
    
    // 3. Four of a Kind → HOLD ALL
    if (counts[0] === 4) {
      return { decision: 'HOLD ALL', reason: 'Four of a Kind!', holdIndices: [1, 2, 3, 4, 5] };
    }
    
    // 4. Full House → HOLD ALL
    if (counts[0] === 3 && counts[1] === 2) {
      return { decision: 'HOLD ALL', reason: 'Full House!', holdIndices: [1, 2, 3, 4, 5] };
    }
    
    // 5. Flush → HOLD ALL
    if (isFlush && !isStraightFlush) {
      return { decision: 'HOLD ALL', reason: 'Flush!', holdIndices: [1, 2, 3, 4, 5] };
    }
    
    // 6. Straight → HOLD ALL
    if ((isStraight || isWheelStraight) && !isStraightFlush) {
      return { decision: 'HOLD ALL', reason: 'Straight!', holdIndices: [1, 2, 3, 4, 5] };
    }
    
    // 7. Three of a Kind → HOLD the three matching
    if (counts[0] === 3) {
      const threeRank = Object.keys(rankCounts).find(k => rankCounts[k] === 3);
      const indices = cards.filter(c => c.value == threeRank).map(c => c.index);
      return { decision: `HOLD cards ${indices.join(', ')}`, reason: 'Three of a Kind', holdIndices: indices };
    }
    
    // 8. Two Pair → HOLD both pairs
    if (counts[0] === 2 && counts[1] === 2) {
      const pairRanks = Object.keys(rankCounts).filter(k => rankCounts[k] === 2);
      const indices = cards.filter(c => pairRanks.includes(String(c.value))).map(c => c.index);
      return { decision: `HOLD cards ${indices.join(', ')}`, reason: 'Two Pair', holdIndices: indices };
    }
    
    // 9. High Pair (J, Q, K, A) → HOLD the pair
    if (counts[0] === 2) {
      const pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 2));
      const pairIndices = cards.filter(c => c.value == pairRank).map(c => c.index);
      
      if (pairRank >= 11) {
        // High pair beats 4 to flush per research doc
        return { decision: `HOLD cards ${pairIndices.join(', ')}`, reason: 'High Pair (Jacks or Better)', holdIndices: pairIndices };
      }
    }
    
    // 10. Four to a Flush → HOLD those four (beats low pair)
    const maxSuitCount = Math.max(...Object.values(suitCounts));
    if (maxSuitCount === 4) {
      const flushSuit = Object.keys(suitCounts).find(s => suitCounts[s] === 4);
      const flushIndices = cards.filter(c => c.suit === flushSuit).map(c => c.index);
      // Check if we have a low pair - if so, 4 to flush beats it
      if (counts[0] === 2) {
        const pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 2));
        if (pairRank < 11) {
          return { decision: `HOLD cards ${flushIndices.join(', ')}`, reason: '4 to Flush beats Low Pair', holdIndices: flushIndices };
        }
      }
      return { decision: `HOLD cards ${flushIndices.join(', ')}`, reason: '4 to a Flush', holdIndices: flushIndices };
    }
    
    // 11. Low Pair (2-10) → HOLD the pair
    if (counts[0] === 2) {
      const pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 2));
      const pairIndices = cards.filter(c => c.value == pairRank).map(c => c.index);
      if (pairRank < 11) {
        return { decision: `HOLD cards ${pairIndices.join(', ')}`, reason: 'Low Pair', holdIndices: pairIndices };
      }
    }
    
    // 12. Four to an Open-Ended Straight → HOLD those four
    // Check for 4-card straight possibilities
    const hasFourToStraight = () => {
      const sorted = [...sortedValues].sort((a, b) => a - b);
      // Check for consecutive sequences of 4
      for (let i = 0; i < sorted.length - 3; i++) {
        const seq = sorted.slice(i, i + 4);
        if (seq.every((val, idx, arr) => idx === 0 || val === arr[idx-1] + 1)) {
          return true;
        }
      }
      // Check for sequences like 2-3-4-5 (can complete with A or 6)
      if (sorted[0] === 2 && sorted[1] === 3 && sorted[2] === 4 && sorted[3] === 5) return true;
      // Check for sequences like 10-J-Q-K (can complete with 9 or A)
      if (sorted[1] === 10 && sorted[2] === 11 && sorted[3] === 12 && sorted[4] === 13) return true;
      return false;
    };
    
    if (hasFourToStraight()) {
      // Find the 4 cards that form the straight
      const sorted = [...sortedValues].sort((a, b) => a - b);
      let straightIndices = [];
      for (let i = 0; i < sorted.length - 3; i++) {
        const seq = sorted.slice(i, i + 4);
        if (seq.every((val, idx, arr) => idx === 0 || val === arr[idx-1] + 1)) {
          straightIndices = cards.filter(c => seq.includes(c.value)).map(c => c.index);
          break;
        }
      }
      if (straightIndices.length === 4) {
        return { decision: `HOLD cards ${straightIndices.join(', ')}`, reason: '4 to an Open-Ended Straight', holdIndices: straightIndices };
      }
    }
    
    // 13. Three to a Royal Flush → HOLD those three
    const highCards = cards.filter(c => c.value >= 11);
    if (highCards.length >= 3) {
      const royalSuits = {};
      highCards.forEach(card => {
        if (!royalSuits[card.suit]) royalSuits[card.suit] = [];
        royalSuits[card.suit].push(card);
      });
      // Check if we have 3+ high cards of same suit (potential royal)
      for (const suit in royalSuits) {
        if (royalSuits[suit].length >= 3) {
          const royalIndices = royalSuits[suit].slice(0, 3).map(c => c.index);
          return { decision: `HOLD cards ${royalIndices.join(', ')}`, reason: '3 to a Royal Flush', holdIndices: royalIndices };
        }
      }
    }
    
    // 14. Two Suited High Cards → HOLD those two
    const suitedHighCards = {};
    highCards.forEach(card => {
      if (!suitedHighCards[card.suit]) suitedHighCards[card.suit] = [];
      suitedHighCards[card.suit].push(card);
    });
    for (const suit in suitedHighCards) {
      if (suitedHighCards[suit].length >= 2) {
        const indices = suitedHighCards[suit].slice(0, 2).map(c => c.index);
        return { decision: `HOLD cards ${indices.join(', ')}`, reason: 'Two Suited High Cards', holdIndices: indices };
      }
    }
    
    // 15. Two Unsuited High Cards → HOLD those two
    if (highCards.length >= 2) {
      const indices = highCards.slice(0, 2).map(c => c.index);
      return { decision: `HOLD cards ${indices.join(', ')}`, reason: 'Two High Cards (J, Q, K, A)', holdIndices: indices };
    }
    
    // 16. One High Card → HOLD that one
    if (highCards.length >= 1) {
      const index = highCards[0].index;
      return { decision: `HOLD card ${index}`, reason: 'Single High Card', holdIndices: [index] };
    }
    
    // 17. Nothing → DISCARD ALL
    return { decision: 'DISCARD ALL', reason: 'Draw 5 new cards', holdIndices: [] };
  };

  const threeCardResult = get3CardDecision();
  const blackjackResult = getBlackjackDecision();
  const videoPokerResult = getVideoPokerDecision();

  // Extract hold indices from video poker result
  const videoPokerHoldIndices = videoPokerResult?.holdIndices || [];

  // Save result when complete
  useEffect(() => {
    if (threeCardResult && threeCardHand.length === 3) {
      saveRecentHand('3card', threeCardHand, threeCardResult);
    }
  }, [threeCardResult, threeCardHand]);

  useEffect(() => {
    if (blackjackResult && playerHand && dealerCard) {
      saveRecentHand('blackjack', { playerHand, dealerCard, isSoft, isPair }, blackjackResult);
    }
  }, [blackjackResult, playerHand, dealerCard, isSoft, isPair]);

  useEffect(() => {
    if (videoPokerResult && videoPokerHand.length === 5) {
      saveRecentHand('videopoker', videoPokerHand, videoPokerResult);
    }
  }, [videoPokerResult, videoPokerHand]);

  // Copy to clipboard
  const handleCopy = () => {
    let text = '';
    if (activeGame === '3card' && threeCardResult) {
      const handStr = threeCardHand.map(c => `${c.rank}${c.suit}`).join(' ');
      text = `3-Card Poker: ${handStr} → ${threeCardResult.decision} (${threeCardResult.reason})`;
    } else if (activeGame === 'blackjack' && blackjackResult) {
      text = `Blackjack: ${playerHand} vs Dealer ${dealerCard}${isSoft ? ' (Soft)' : ''}${isPair ? ' (Pair)' : ''} → ${blackjackResult.decision} (${blackjackResult.reason})`;
    } else if (activeGame === 'videopoker' && videoPokerResult) {
      const handStr = videoPokerHand.map(c => `${c.rank}${c.suit}`).join(' ');
      text = `Video Poker: ${handStr} → ${videoPokerResult.decision} (${videoPokerResult.reason})`;
    }
    
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // New hand handlers
  const handleNew3CardHand = () => {
    setThreeCardHand([]);
  };

  const handleNewBlackjackHand = () => {
    setPlayerHand('');
    setDealerCard('');
    setIsSoft(false);
    setIsPair(false);
  };

  const handleNewVideoPokerHand = () => {
    setVideoPokerHand([]);
  };

  // Preset handlers
  const handle3CardPreset = (cards) => {
    setThreeCardHand(cards);
  };

  const handleVideoPokerPreset = (cards) => {
    setVideoPokerHand(cards);
  };

  // Load recent hand
  const loadRecentHand = (hand) => {
    if (hand.gameType === '3card') {
      setActiveGame('3card');
      setThreeCardHand(hand.hand);
    } else if (hand.gameType === 'blackjack') {
      setActiveGame('blackjack');
      setPlayerHand(hand.hand.playerHand);
      setDealerCard(hand.hand.dealerCard);
      setIsSoft(hand.hand.isSoft || false);
      setIsPair(hand.hand.isPair || false);
    } else if (hand.gameType === 'videopoker') {
      setActiveGame('videopoker');
      setVideoPokerHand(hand.hand);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2 flex items-center justify-center gap-2">
            <CreditCard className="w-8 h-8 md:w-10 md:h-10" />
            Casino Strategy Calculator
          </h1>
          <p className="text-green-100 text-lg">Get optimal plays for 3 Card Poker, Blackjack & Video Poker</p>
        </div>

        {/* Keyboard shortcuts help */}
        <div className="relative mb-4 flex justify-end">
          <button
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-sm transition-all"
          >
            <Keyboard className="w-4 h-4" />
            Keyboard Shortcuts
          </button>
          {showKeyboardHelp && (
            <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-50 min-w-[280px]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">⌨️ Keyboard Shortcuts</h3>
                <button onClick={() => setShowKeyboardHelp(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>A-K</strong> + <strong>S/H/D/C</strong> = Select card</div>
                <div><strong>Space</strong> = Confirm</div>
                <div><strong>Backspace</strong> = Remove last</div>
                <div><strong>Enter</strong> = Calculate</div>
                <div><strong>Escape</strong> = Clear all</div>
                <div className="mt-2 text-xs text-gray-400">Example: "KH" = King of Hearts</div>
              </div>
            </div>
          )}
        </div>

        {/* Recent hands */}
        {recentHands.length > 0 && (
          <div className="mb-4 bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">Recent Hands:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {recentHands.map((hand, idx) => (
                <button
                  key={idx}
                  onClick={() => loadRecentHand(hand)}
                  className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white text-xs transition-all"
                >
                  {hand.gameType === '3card' && hand.hand.map(c => `${c.rank}${c.suit}`).join(' ')}
                  {hand.gameType === 'blackjack' && `${hand.hand.playerHand} vs ${hand.hand.dealerCard}`}
                  {hand.gameType === 'videopoker' && hand.hand.map(c => `${c.rank}${c.suit}`).join(' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {[
            { id: '3card', label: '3 Card Poker' },
            { id: 'blackjack', label: 'Blackjack' },
            { id: 'videopoker', label: 'Jacks or Better' }
          ].map(game => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeGame === game.id
                  ? 'bg-yellow-400 text-green-900 shadow-lg scale-105'
                  : 'bg-green-700 text-green-100 hover:bg-green-600'
              }`}
            >
              {game.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6">
          {activeGame === '3card' && (
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-4">3 Card Poker Hand</h2>
              
              <PresetHands gameType="3card" onSelectPreset={handle3CardPreset} />
              
              <SelectedCards
                cards={threeCardHand}
                maxCards={3}
                onRemoveCard={(index) => {
                  const newHand = [...threeCardHand];
                  newHand.splice(index, 1);
                  setThreeCardHand(newHand);
                }}
              />

              <CardGrid
                selectedCards={threeCardHand}
                maxCards={3}
                onCardSelect={setThreeCardHand}
              />

              {threeCardResult && (
                <div className="mt-6">
                  <ResultCard
                    decision={threeCardResult.decision}
                    reason={threeCardResult.reason}
                    onNewHand={handleNew3CardHand}
                    onCopy={handleCopy}
                    animated={true}
                  />
                </div>
              )}
            </div>
          )}

          {activeGame === 'blackjack' && (
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-4">Blackjack Hand</h2>
              
              <div className="space-y-6 mb-6">
                <NumberPad
                  value={playerHand}
                  onChange={setPlayerHand}
                  onClear={handleNewBlackjackHand}
                />

                <DealerCardButtons
                  selectedCard={dealerCard}
                  onSelect={setDealerCard}
                />

                <ToggleChips
                  isSoft={isSoft}
                  isPair={isPair}
                  onSoftToggle={() => {
                    setIsSoft(!isSoft);
                    if (!isSoft) setIsPair(false);
                  }}
                  onPairToggle={() => {
                    setIsPair(!isPair);
                    if (!isPair) setIsSoft(false);
                  }}
                />
              </div>

              {blackjackResult && (
                <div className="mt-6">
                  <ResultCard
                    decision={blackjackResult.decision}
                    reason={blackjackResult.reason}
                    onNewHand={handleNewBlackjackHand}
                    onCopy={handleCopy}
                    animated={true}
                  />
                </div>
              )}
            </div>
          )}

          {activeGame === 'videopoker' && (
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-4">Jacks or Better - 5 Card Hand</h2>
              
              <PresetHands gameType="videopoker" onSelectPreset={handleVideoPokerPreset} />
              
              <SelectedCards
                cards={videoPokerHand}
                maxCards={5}
                holdIndices={videoPokerHoldIndices}
                onRemoveCard={(index) => {
                  const newHand = [...videoPokerHand];
                  newHand.splice(index, 1);
                  setVideoPokerHand(newHand);
                }}
              />

              <CardGrid
                selectedCards={videoPokerHand}
                maxCards={5}
                onCardSelect={setVideoPokerHand}
              />

              {videoPokerResult && (
                <div className="mt-6">
                  <ResultCard
                    decision={videoPokerResult.decision}
                    reason={videoPokerResult.reason}
                    onNewHand={handleNewVideoPokerHand}
                    onCopy={handleCopy}
                    animated={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Copy notification */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[fadeInUp_0.3s_ease-out]">
            Copied to clipboard!
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">💡 Pro Tip:</h3>
          <p className="text-yellow-800 text-sm">
            {activeGame === '3card' && 'Remember Q-6-4 or better to raise. That\'s literally all you need to know!'}
            {activeGame === 'blackjack' && 'Basic strategy reduces house edge to ~0.5%. Always split Aces and 8s, never split 5s or 10s!'}
            {activeGame === 'videopoker' && 'Full-pay 9/6 Jacks or Better returns 99.54% with perfect play. Always play max coins for the royal flush jackpot!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CasinoStrategyCalculator;
