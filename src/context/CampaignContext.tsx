import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadCampaignsFromFile, saveCampaignsToFile, createCampaign, deleteCampaign, updateCampaign, saveSelectedCampaignToFile, loadSelectedCampaignFromFile } from '../utils/fileStorage';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaignContextType {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  selectedCampaign: Campaign | null;
  createCampaign: (name: string, description?: string) => string;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;
  updateCampaign: (id: string, name: string, description?: string) => void;
  clearSelectedCampaign: () => void;
  loadCampaigns: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | null>(null);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');

  // Load campaigns and selected campaign on mount
  useEffect(() => {
    loadCampaigns();
    loadSelectedCampaign();
  }, []);

  const loadCampaigns = async () => {
    try {
      const loadedCampaigns = await loadCampaignsFromFile();
      setCampaigns(loadedCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const loadSelectedCampaign = async () => {
    try {
      const savedCampaignId = await loadSelectedCampaignFromFile();
      if (savedCampaignId) {
        setSelectedCampaignId(savedCampaignId);
      }
    } catch (error) {
      console.error('Error loading selected campaign:', error);
    }
  };

  const saveSelectedCampaign = async (campaignId: string | null) => {
    try {
      await saveSelectedCampaignToFile(campaignId);
    } catch (error) {
      console.error('Error saving selected campaign:', error);
    }
  };

  const createCampaign = (name: string, description?: string): string => {
    const id = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newCampaign: Campaign = {
      id,
      name,
      description,
      createdAt: now,
      updatedAt: now,
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setSelectedCampaignId(id);
    
    // Save to storage
    saveCampaignsToFile([...campaigns, newCampaign]);
    
    return id;
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => {
      const updated = prev.filter(campaign => campaign.id !== id);
      saveCampaignsToFile(updated);
      
      // If we deleted the selected campaign, clear selection
      if (selectedCampaignId === id) {
        setSelectedCampaignId(null);
      }
      
      return updated;
    });
  };

  const selectCampaign = (id: string | null) => {
    setSelectedCampaignId(id);
    saveSelectedCampaign(id);
    
    // Clear current combat when changing campaign
    // We need to import useCombat here, but since this is a context provider,
    // we'll handle this in the components that use selectCampaign
  };

  const updateCampaign = (id: string, name: string, description?: string) => {
    setCampaigns(prev => {
      const updated = prev.map(campaign => {
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
      
      saveCampaignsToFile(updated);
      return updated;
    });
  };

        const clearSelectedCampaign = () => {
    setSelectedCampaignId('all');
    saveSelectedCampaign('all');
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || null;

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        selectedCampaignId,
        selectedCampaign,
    selectedCampaignId,
        createCampaign,
        deleteCampaign,
        selectCampaign,
        updateCampaign,
        clearSelectedCampaign,
        loadCampaigns,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaign must be used within a CampaignProvider');
  return ctx;
}
