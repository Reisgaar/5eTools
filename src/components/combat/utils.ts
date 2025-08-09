import { Combatant } from '../../context/CombatContext';
import { CombatGroupData } from './types';
import { getCombatTrackerImages } from '../../utils/imageManager';

export const getGroupedCombatants = (combatants: Combatant[]): CombatGroupData[] => {
  const grouped: { [nameOrigin: string]: Combatant[] } = {};
  
  combatants.forEach(combatant => {
    const nameOrigin = combatant.name;
    if (!grouped[nameOrigin]) {
      grouped[nameOrigin] = [];
    }
    grouped[nameOrigin].push(combatant);
  });

  return Object.entries(grouped).map(([nameOrigin, members]) => {
    const firstMember = members[0];
    const showGroupButton = members.length > 1;
    
    return {
      name: firstMember.name,
      source: firstMember.source,
      nameOrigin,
      initiative: firstMember.initiative,
      initiativeBonus: firstMember.initiativeBonus,
      passivePerception: firstMember.passivePerception,
      groupMembers: members,
      showGroupButton
    };
  });
};

export const loadCachedTokenUrl = async (
  tokenUrl: string | undefined, 
  source: string, 
  name: string
): Promise<string | undefined> => {
  if (!tokenUrl || !source || !name) return undefined;
  
  try {
    // Use the new image manager for better caching
    const images = await getCombatTrackerImages(source, name);
    return images.displayUrl;
  } catch (error) {
    console.error('Error loading cached token URL:', error);
    return undefined;
  }
};

// Get both display and modal images for combat tracker
export const loadCombatImages = async (
  source: string, 
  name: string
): Promise<{
  displayUrl: string;
  modalUrl: string;
  displayType: 'token' | 'full';
  modalType: 'token' | 'full';
}> => {
  try {
    return await getCombatTrackerImages(source, name);
  } catch (error) {
    console.error('Error loading combat images:', error);
    // Fallback to default URLs
    const encodedName = encodeURIComponent(name);
    return {
      displayUrl: `https://5e.tools/img/bestiary/tokens/${source}/${encodedName}.webp`,
      modalUrl: `https://5e.tools/img/bestiary/${source}/${encodedName}.webp`,
      displayType: 'token',
      modalType: 'full'
    };
  }
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString() + ' ' + 
         new Date(timestamp).toLocaleTimeString([], { 
           hour: '2-digit', 
           minute: '2-digit' 
         });
};
