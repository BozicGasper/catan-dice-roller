import { create } from 'zustand';

interface Player {
  id: string;
  name: string;
}

interface DiceRoll {
  id: string;
  timestamp: number;
  values: number[];
  player: string;
  round: number;
  pirateCount: number;
}

interface Game {
  id: string;
  startTime: number;
  endTime: number | null;
  rolls: DiceRoll[];
  players: Player[];
}

interface AlchemistState {
  isActive: boolean;
  presetValues: [number, number];
  highlightSecondDice: boolean;
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  round: number;
  thirdDiceEnabled: boolean;
  rollHistory: DiceRoll[];
  previousState: {
    currentPlayerIndex: number;
    round: number;
    rollHistory: DiceRoll[];
    pirateCount: number;
  } | null;
  games: Game[];
  currentGame: Game | null;
  pirateCount: number;
  alchemist: AlchemistState;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  reorderPlayers: (players: Player[]) => void;
  nextTurn: () => void;
  toggleThirdDice: () => void;
  addRoll: (values: number[]) => void;
  clearHistory: () => void;
  resetGame: () => void;
  undoLastRoll: () => void;
  startNewGame: (players: string[]) => void;
  endCurrentGame: () => void;
  getPirateProgress: () => number;
  resetPirateCount: () => void;
  setAlchemistValues: (
    values: [number, number],
    highlightSecond: boolean
  ) => void;
  clearAlchemist: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentPlayerIndex: 0,
  round: 1,
  thirdDiceEnabled: false,
  rollHistory: [],
  previousState: null,
  games: [],
  currentGame: null,
  pirateCount: 0,
  alchemist: {
    isActive: false,
    presetValues: [1, 1],
    highlightSecondDice: false,
  },

  addPlayer: (name) =>
    set((state) => ({
      players: [...state.players, { id: Date.now().toString(), name }],
    })),

  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((player) => player.id !== id),
    })),

  reorderPlayers: (players) => set({ players }),

  nextTurn: () =>
    set((state) => {
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      return {
        currentPlayerIndex: nextIndex,
        round: nextIndex === 0 ? state.round + 1 : state.round,
      };
    }),

  toggleThirdDice: () =>
    set((state) => ({
      thirdDiceEnabled: !state.thirdDiceEnabled,
      pirateCount: 0,
    })),

  addRoll: (values) =>
    set((state) => {
      const currentPlayer = state.players[state.currentPlayerIndex];

      const previousState = {
        currentPlayerIndex: state.currentPlayerIndex,
        round: state.round,
        rollHistory: state.rollHistory,
        pirateCount: state.pirateCount,
      };

      let newPirateCount = state.pirateCount;

      if (state.thirdDiceEnabled) {
        if (state.pirateCount >= 8) {
          newPirateCount = 0;
        }

        if (values[2] > 3) {
          newPirateCount += 1;
        }
      }

      const roll: DiceRoll = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        values,
        player: currentPlayer?.name || 'Unknown',
        round: state.round,
        pirateCount: newPirateCount,
      };

      const currentGame = state.currentGame
        ? {
            ...state.currentGame,
            rolls: [roll, ...state.currentGame.rolls],
          }
        : null;

      // Clear alchemist after use
      const alchemist = state.alchemist.isActive
        ? {
            isActive: false,
            presetValues: [1, 1] as [number, number],
            highlightSecondDice: false,
          }
        : state.alchemist;

      return {
        rollHistory: [roll, ...state.rollHistory],
        previousState,
        pirateCount: newPirateCount,
        currentGame,
        alchemist,
      };
    }),

  clearHistory: () => set({ rollHistory: [] }),

  resetGame: () =>
    set({
      currentPlayerIndex: 0,
      round: 1,
      rollHistory: [],
      previousState: null,
      currentGame: null,
      games: [],
      players: [],
      pirateCount: 0,
      thirdDiceEnabled: false,
      alchemist: {
        isActive: false,
        presetValues: [1, 1],
        highlightSecondDice: false,
      },
    }),

  undoLastRoll: () =>
    set((state) => {
      if (!state.previousState) return state;

      return {
        currentPlayerIndex: state.previousState.currentPlayerIndex,
        round: state.previousState.round,
        rollHistory: state.previousState.rollHistory,
        pirateCount: state.previousState.pirateCount,
        previousState: null,
      };
    }),

  startNewGame: (players) =>
    set({
      currentGame: {
        id: Date.now().toString(),
        startTime: Date.now(),
        endTime: null,
        rolls: [],
        players: players.map((name) => ({
          id: Date.now().toString() + name,
          name,
        })),
      },
      players: players.map((name) => ({
        id: Date.now().toString() + name,
        name,
      })),
      rollHistory: [],
      round: 1,
      currentPlayerIndex: 0,
      pirateCount: 0,
      alchemist: {
        isActive: false,
        presetValues: [1, 1],
        highlightSecondDice: false,
      },
    }),

  endCurrentGame: () =>
    set((state) => {
      if (!state.currentGame) return state;

      const completedGame = {
        ...state.currentGame,
        endTime: Date.now(),
      };

      return {
        games: [completedGame, ...state.games],
        currentGame: null,
        players: [],
      };
    }),

  getPirateProgress: () => {
    const state = get();
    return (state.pirateCount / 8) * 100;
  },

  resetPirateCount: () => set({ pirateCount: 0 }),

  setAlchemistValues: (values: [number, number], highlightSecond: boolean) =>
    set({
      alchemist: {
        isActive: true,
        presetValues: values,
        highlightSecondDice: highlightSecond,
      },
    }),

  clearAlchemist: () =>
    set({
      alchemist: {
        isActive: false,
        presetValues: [1, 1],
        highlightSecondDice: false,
      },
    }),
}));

export const calculateHistogram = (rolls: DiceRoll[]) => {
  const histogram = new Array(11).fill(0);

  rolls.forEach((roll) => {
    const sum = roll.values[0] + roll.values[1];
    histogram[sum - 2]++;
  });

  return histogram;
};

export const isPirateAttack = (pirateCount: number) => pirateCount >= 8;

export const isRobberEvent = (values: number[]) => values[0] + values[1] === 7;

export const getCityDiceColor = (value: number): string | null => {
  switch (value) {
    case 1:
      return '#eab308';
    case 2:
      return '#22c55e';
    case 3:
      return '#3b82f6';
    default:
      return null;
  }
};
