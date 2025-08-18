// REACT
import { create } from 'zustand';

// UTILS
import { loadCampaignsFromFile, saveCampaignsToFile } from 'src/utils/fileStorage';

// TYPES
export interface Campaign {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

// INTERFACES
interface CampaignState {
    campaigns: Campaign[];
    selectedCampaignId: string | null;
    selectedCampaign: Campaign | null;
    createCampaign: (name: string, description?: string) => string;
    deleteCampaign: (id: string) => void;
    selectCampaign: (id: string | null) => void;
    updateCampaign: (id: string, name: string, description?: string) => void;
    clearSelectedCampaign: () => void;
    loadCampaigns: () => Promise<void>;
    initializeCampaigns: () => Promise<void>;
}

/**
 * CampaignStore is a Zustand store that manages campaign data and selection.
 */
export const useCampaignStore = create<CampaignState>((set, get) => ({
    campaigns: [],
    selectedCampaignId: null,
    selectedCampaign: null,

    loadCampaigns: async () => {
        try {
            const loadedCampaigns = await loadCampaignsFromFile();
            set({ campaigns: loadedCampaigns });
        } catch (error) {
            console.error('Error loading campaigns:', error);
        }
    },

    initializeCampaigns: async () => {
        try {
            const loadedCampaigns = await loadCampaignsFromFile();
            const selectedCampaign = loadedCampaigns.find(c => c.id === get().selectedCampaignId) || null;
            set({ campaigns: loadedCampaigns, selectedCampaign });
        } catch (error) {
            console.error('Error initializing campaigns:', error);
        }
    },

    createCampaign: (name: string, description?: string): string => {
        const id = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const newCampaign: Campaign = {
            id,
            name,
            description,
            createdAt: now,
            updatedAt: now,
        };

        const currentCampaigns = get().campaigns;
        const updatedCampaigns = [...currentCampaigns, newCampaign];

        set({ campaigns: updatedCampaigns });
        saveCampaignsToFile(updatedCampaigns);

        return id;
    },

    deleteCampaign: (id: string) => {
        const currentCampaigns = get().campaigns;
        const currentSelectedCampaignId = get().selectedCampaignId;

        const updatedCampaigns = currentCampaigns.filter(campaign => campaign.id !== id);

        // If we deleted the selected campaign, clear selection
        const newSelectedCampaignId = currentSelectedCampaignId === id ? null : currentSelectedCampaignId;
        const newSelectedCampaign = newSelectedCampaignId ? updatedCampaigns.find(c => c.id === newSelectedCampaignId) || null : null;

        set({
            campaigns: updatedCampaigns,
            selectedCampaignId: newSelectedCampaignId,
            selectedCampaign: newSelectedCampaign
        });

        saveCampaignsToFile(updatedCampaigns);
    },

    selectCampaign: (id: string | null) => {
        const currentCampaigns = get().campaigns;
        const selectedCampaign = id ? currentCampaigns.find(c => c.id === id) || null : null;

        set({
            selectedCampaignId: id,
            selectedCampaign
        });
    },

    updateCampaign: (id: string, name: string, description?: string) => {
        const currentCampaigns = get().campaigns;
        const currentSelectedCampaignId = get().selectedCampaignId;

        const updatedCampaigns = currentCampaigns.map(campaign => {
            if (campaign.id === id) {
                return {
                    ...campaign,
                    name,
                    description,
                    updatedAt: new Date().toISOString(),
                };
            }
            return campaign;
        });

        // Update selectedCampaign if it was the one being updated
        const newSelectedCampaign = currentSelectedCampaignId === id
            ? updatedCampaigns.find(c => c.id === id) || null
            : get().selectedCampaign;

        set({
            campaigns: updatedCampaigns,
            selectedCampaign: newSelectedCampaign
        });

        saveCampaignsToFile(updatedCampaigns);
    },

    clearSelectedCampaign: () => {
        set({
            selectedCampaignId: null,
            selectedCampaign: null
        });
    },
}));
