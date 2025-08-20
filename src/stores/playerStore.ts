// REACT
import { create } from 'zustand';

// UTILS
import { loadPlayersList, savePlayersList } from 'src/utils/fileStorage';

// TYPES
import { Player } from 'src/models/interfaces/utils';

// INTERFACES
interface PlayerState {
    players: Player[];
    selectedPlayerName: string | null;
    selectedPlayer: Player | null;
    createPlayer: (player: Player) => void;
    deletePlayer: (name: string) => void;
    selectPlayer: (name: string | null) => void;
    updatePlayer: (name: string, updatedPlayer: Partial<Player>) => void;
    clearSelectedPlayer: () => void;
    loadPlayers: () => Promise<void>;
    initializePlayers: () => Promise<void>;
    resetPlayers: () => void;
}

/**
 * PlayerStore is a Zustand store that manages player data and selection.
 */
export const usePlayerStore = create<PlayerState>((set, get) => ({
    players: [],
    selectedPlayerName: null,
    selectedPlayer: null,

    loadPlayers: async () => {
        try {
            const loadedPlayers = await loadPlayersList();
            set({ players: loadedPlayers });
        } catch (error) {
            console.error('Error loading players:', error);
        }
    },

    initializePlayers: async () => {
        try {
            const loadedPlayers = await loadPlayersList();
            const selectedPlayer = loadedPlayers.find(p => p.name === get().selectedPlayerName) || null;
            set({ players: loadedPlayers, selectedPlayer });
        } catch (error) {
            console.error('Error initializing players:', error);
        }
    },

    createPlayer: (player: Player) => {
        const currentPlayers = get().players;
        const updatedPlayers = [...currentPlayers, player];

        set({ players: updatedPlayers });
        savePlayersList(updatedPlayers);
    },

    deletePlayer: (name: string) => {
        const currentPlayers = get().players;
        const currentSelectedPlayerName = get().selectedPlayerName;

        const updatedPlayers = currentPlayers.filter(player => player.name !== name);

        // If we deleted the selected player, clear selection
        const newSelectedPlayerName = currentSelectedPlayerName === name ? null : currentSelectedPlayerName;
        const newSelectedPlayer = newSelectedPlayerName ? updatedPlayers.find(p => p.name === newSelectedPlayerName) || null : null;

        set({
            players: updatedPlayers,
            selectedPlayerName: newSelectedPlayerName,
            selectedPlayer: newSelectedPlayer
        });

        savePlayersList(updatedPlayers);
    },

    selectPlayer: (name: string | null) => {
        const currentPlayers = get().players;
        const selectedPlayer = name ? currentPlayers.find(p => p.name === name) || null : null;

        set({
            selectedPlayerName: name,
            selectedPlayer
        });
    },

    updatePlayer: (name: string, updatedPlayer: Partial<Player>) => {
        const currentPlayers = get().players;
        const currentSelectedPlayerName = get().selectedPlayerName;

        const updatedPlayers = currentPlayers.map(player =>
            player.name === name ? { ...player, ...updatedPlayer } : player
        );

        // Update selected player if it was the one being updated
        const newSelectedPlayer = currentSelectedPlayerName === name 
            ? updatedPlayers.find(p => p.name === name) || null 
            : get().selectedPlayer;

        set({
            players: updatedPlayers,
            selectedPlayer: newSelectedPlayer
        });

        savePlayersList(updatedPlayers);
    },

    clearSelectedPlayer: () => {
        set({
            selectedPlayerName: null,
            selectedPlayer: null
        });
    },

    resetPlayers: () => {
        set({
            players: [],
            selectedPlayerName: null,
            selectedPlayer: null
        });
    },
}));
