import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  Modal,
} from 'react-native';
import {
  useGameStore,
  isRobberEvent,
  isPirateAttack,
  getCityDiceColor,
} from '@/store/gameStore';
import { useThemeStore } from '@/store/themeStore';
import { Dice } from '@/components/Dice';
import { DiceSelector } from '@/components/DiceSelector';
import { RotateCcw, Moon, Sun, FlaskRound as Flask } from 'lucide-react-native';
import { PirateProgress } from '@/components/PirateProgress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

const pirateSound = require('@/assets/sounds/the-pirates-are-attacking.mp3');
const lockPickSound = require('@/assets/sounds/your-lock-is-getting-picked.mp3');
const alchemistSound = require('@/assets/sounds/halucinate-now.mp3');

export default function DiceScreen() {
  const insets = useSafeAreaInsets();
  const [diceValues, setDiceValues] = useState<number[]>([1, 1, 1]);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showAlchemistDialog, setShowAlchemistDialog] = useState(false);
  const [playerInput, setPlayerInput] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [citiesAndKnightsEnabled, setCitiesAndKnightsEnabled] = useState(false);
  const [alchemistValues, setAlchemistValues] = useState<[number, number]>([
    1, 1,
  ]);
  const [highlightSecondDice, setHighlightSecondDice] = useState(false);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playAlchemistSound() {
    const { sound } = await Audio.Sound.createAsync(alchemistSound);
    setSound(sound);

    await sound.playAsync();
  }

  async function playLockSound() {
    const { sound } = await Audio.Sound.createAsync(lockPickSound);
    setSound(sound);

    await sound.playAsync();
  }

  async function playPirateAttackSound() {
    const { sound } = await Audio.Sound.createAsync(pirateSound);
    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const {
    players: gamePlayers,
    currentPlayerIndex,
    round,
    thirdDiceEnabled,
    addRoll,
    nextTurn,
    undoLastRoll,
    getPirateProgress,
    currentGame,
    startNewGame,
    pirateCount,
    toggleThirdDice,
    alchemist,
    setAlchemistValues: setStoreAlchemistValues,
  } = useGameStore();

  const { isDark, toggleTheme, colors } = useThemeStore();

  const handleStartNewGame = () => {
    setShowNewGameDialog(true);
  };

  const handleAddPlayer = () => {
    if (playerInput.trim()) {
      setPlayers([...players, playerInput.trim()]);
      setPlayerInput('');
    }
  };

  const handleStartGame = () => {
    if (players.length === 0) {
      Alert.alert('Error', 'Please add at least one player');
      return;
    }
    if (citiesAndKnightsEnabled) {
      toggleThirdDice();
    }
    startNewGame(players);
    setShowNewGameDialog(false);
    setPlayers([]);
  };

  const handleAlchemistConfirm = () => {
    setStoreAlchemistValues(alchemistValues, highlightSecondDice);
    setShowAlchemistDialog(false);

  };

  const rollDice = () => {
    if (!currentGame) {
      handleStartNewGame();
      return;
    }

    performRoll();
  };

  const performRoll = async () => {
    if (gamePlayers.length === 0) {
      Alert.alert(
        'No Players',
        'Please add at least one player in the settings before rolling.'
      );
      return;
    }

    let newValues: number[];

    if (alchemist.isActive) {
      await playAlchemistSound();
      const thirdValue = thirdDiceEnabled
        ? Math.floor(Math.random() * 6) + 1
        : 1;
      newValues = [...alchemist.presetValues, thirdValue];
    } else {
      newValues = Array(thirdDiceEnabled ? 3 : 2)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1);
    }

    // Calculate if this roll will trigger a pirate attack
    if (thirdDiceEnabled && newValues[2] > 3) {
      const newPirateCount = pirateCount + 1;
      if (newPirateCount === 8) {
        await playPirateAttackSound();

        Alert.alert(
          'Pirates Attack!',
          'The pirates are attacking! (8 black dice rolls reached)'
        );
      }
    }

    setDiceValues(newValues);

    if (isRobberEvent(newValues)) {
      // Alert.alert('Robber Event!', 'The robber has been activated! (Sum is 7)');
      playLockSound();
    }

    addRoll(newValues);
    nextTurn();
  };

  const currentPlayer = gamePlayers[currentPlayerIndex]?.name || 'Unknown';
  const pirateProgress = getPirateProgress();
  const cityDiceColor =
    thirdDiceEnabled && diceValues[2] <= 3
      ? getCityDiceColor(diceValues[2])
      : null;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      marginTop: 60,
      marginBottom: 40,
      alignItems: 'center',
    },
    roundText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    playerText: {
      fontSize: 18,
      color: colors.subtext,
    },
    diceContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
    },
    controls: {
      gap: 16,
      marginBottom: 40,
      alignItems: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    undoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 8,
    },
    undoButtonText: {
      color: colors.subtext,
      fontSize: 16,
      fontWeight: '500',
    },
    startGameContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    startButton: {
      backgroundColor: colors.primary,
      width: '100%',
    },
    dialogContainer: {
      padding: 20,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginTop: insets.top + 20,
    },
    dialogTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    dialogSubtitle: {
      fontSize: 18,
      color: colors.subtext,
      marginBottom: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    input: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      fontSize: 16,
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      justifyContent: 'center',
      borderRadius: 8,
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    playerName: {
      fontSize: 16,
      color: colors.text,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
    },
    themeToggle: {
      position: 'absolute',
      top: insets.top + 20,
      right: 20,
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.surface,
      zIndex: 1,
    },
    alchemistButton: {
      position: 'absolute',
      top: insets.top + 20,
      left: 20,
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.surface,
      zIndex: 1,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    modalContent: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 12,
      width: '90%',
      maxWidth: 500,
    },
    diceSelectors: {
      marginVertical: 20,
    },
    diceSelectorLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    totalSum: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginVertical: 16,
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 8,
    },
    modalButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    modalButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  if (showNewGameDialog) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          {isDark ? (
            <Sun size={24} color={colors.text} />
          ) : (
            <Moon size={24} color={colors.text} />
          )}
        </TouchableOpacity>
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>New Game Setup</Text>

          <View style={styles.option}>
            <Text style={styles.optionText}>Cities & Knights</Text>
            <Switch
              value={citiesAndKnightsEnabled}
              onValueChange={setCitiesAndKnightsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={
                citiesAndKnightsEnabled ? colors.primary : colors.surface
              }
            />
          </View>

          <Text style={styles.dialogSubtitle}>Add Players</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={playerInput}
              onChangeText={setPlayerInput}
              placeholder="Enter player name"
              placeholderTextColor={colors.subtext}
              onSubmitEditing={handleAddPlayer}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddPlayer}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {players.map((player, index) => (
            <Text key={index} style={styles.playerName}>
              {player}
            </Text>
          ))}

          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartGame}
          >
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        {isDark ? (
          <Sun size={24} color={colors.text} />
        ) : (
          <Moon size={24} color={colors.text} />
        )}
      </TouchableOpacity>

      {thirdDiceEnabled && currentGame && (
        <TouchableOpacity
          style={styles.alchemistButton}
          onPress={() => setShowAlchemistDialog(true)}
        >
          <Flask
            size={24}
            color={alchemist.isActive ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      )}

      <Modal
        visible={showAlchemistDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlchemistDialog(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.dialogTitle}>Alchemist</Text>
            <Text style={styles.dialogSubtitle}>
              Set dice values for next roll
            </Text>

            <View style={styles.diceSelectors}>
              <Text style={styles.diceSelectorLabel}>First Dice</Text>
              <DiceSelector
                value={alchemistValues[0]}
                onChange={(value) =>
                  setAlchemistValues([value, alchemistValues[1]])
                }
                color={colors.primary}
              />

              <Text style={styles.diceSelectorLabel}>Second Dice</Text>
              <DiceSelector
                value={alchemistValues[1]}
                onChange={(value) =>
                  setAlchemistValues([alchemistValues[0], value])
                }
                color={colors.primary}
                isHighlightable={true}
                isHighlighted={highlightSecondDice}
              />
            </View>

            <Text style={styles.totalSum}>
              Total Sum: {alchemistValues[0] + alchemistValues[1]}
            </Text>

            <View style={styles.option}>
              <Text style={styles.optionText}>Highlight Second Dice</Text>
              <Switch
                value={highlightSecondDice}
                onValueChange={setHighlightSecondDice}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={
                  highlightSecondDice ? colors.primary : colors.surface
                }
              />
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAlchemistConfirm}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.border }]}
              onPress={() => setShowAlchemistDialog(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {currentGame ? (
        <>
          <View style={styles.header}>
            <Text style={styles.roundText}>Round {round}</Text>
            <Text style={styles.playerText}>
              Current Player: {currentPlayer}
            </Text>
          </View>

          {thirdDiceEnabled && <PirateProgress progress={pirateProgress} />}

          <View style={styles.diceContainer}>
            <Dice value={diceValues[0]} />
            <Dice
              value={diceValues[1]}
              highlightColor={
                cityDiceColor && !alchemist.highlightSecondDice
                  ? cityDiceColor
                  : undefined
              }
            />
            {thirdDiceEnabled && (
              <Dice
                value={diceValues[2]}
                isCityDice={true}
                highlightColor={
                  cityDiceColor && alchemist.highlightSecondDice
                    ? cityDiceColor
                    : undefined
                }
              />
            )}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={rollDice}>
              <Text style={styles.buttonText}>Roll Dice</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.undoButton} onPress={undoLastRoll}>
              <RotateCcw size={24} color={colors.subtext} />
              <Text style={styles.undoButtonText}>Undo Last Roll</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.startGameContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartNewGame}
          >
            <Text style={styles.buttonText}>Start New Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
