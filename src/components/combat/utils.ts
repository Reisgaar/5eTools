import { Combatant } from '../../context/CombatContext';
import { CombatGroupData } from './types';

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
    const { getCachedTokenUrl } = await import('../../utils/tokenCache');
    return await getCachedTokenUrl(source, name);
  } catch (error) {
    console.error('Error loading cached token URL:', error);
    return undefined;
  }
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString() + ' ' + 
         new Date(timestamp).toLocaleTimeString([], { 
           hour: '2-digit', 
           minute: '2-digit' 
         });
};
