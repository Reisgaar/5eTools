import { Combatant } from '../context/CombatContext';
import { CombatGroupData } from '../models/interfaces/combat';
import { getCombatTrackerImages } from './imageManager';
import { getCachedTokenUrl } from './tokenCache';
import { normalizeString } from './stringUtils';

export const getGroupedCombatants = (combatants: Combatant[]): CombatGroupData[] => {
    const grouped: { [nameOrigin: string]: Combatant[] } = {};
    
    combatants.forEach(combatant => {
        const nameOrigin = combatant.name;
        if (!grouped[nameOrigin])
            grouped[nameOrigin] = [];

        grouped[nameOrigin].push(combatant);
    });

    return Object.entries(grouped).map(([nameOrigin, members]) => {
        const firstMember = members[0];
        const showGroupButton = members.length > 1;
        
        return {
            name: firstMember.name,
            source: firstMember.source,
            nameOrigin,
            key: nameOrigin,
            initiative: firstMember.initiative,
            initiativeBonus: firstMember.initiativeBonus,
            passivePerception: firstMember.passivePerception,
            speed: firstMember.speed,
            senses: firstMember.senses,
            groupMembers: members,
            showGroupButton
        };
    });
};

// Nueva función que genera la lista de visualización correcta
export const getCombatDisplayList = (combatants: Combatant[], groupByName: { [nameOrigin: string]: boolean }, isCombatStarted: boolean = false): CombatGroupData[] => {
    // 1. Obtener todos los combatientes
    const allCombatants = [...combatants];
    
    // 2. Comprobar qué combatientes están agrupados
    const groups = new Map<string, Combatant[]>();
    allCombatants.forEach(combatant => {
        const nameOrigin = `${normalizeString(combatant.name)}-${normalizeString(combatant.source)}`;
        if (!groups.has(nameOrigin))
            groups.set(nameOrigin, []);

        groups.get(nameOrigin)!.push(combatant);
    });
    
    // 3. Crear lista de cómo se tienen que mostrar
    const displayList: CombatGroupData[] = [];
    
    groups.forEach((members, nameOrigin) => {
        const firstMember = members[0];
        
        // Players should never be grouped
        if (firstMember.source === 'player') {
            // Players: always individual entries
            members.forEach(member => {
                displayList.push({
                name: member.name,
                source: member.source,
                nameOrigin: nameOrigin,
                key: `${nameOrigin}-${member.id}`,
                initiative: member.initiative,
                initiativeBonus: member.initiativeBonus,
                speed: member.speed,
                senses: member.senses,
                groupMembers: [member],
                showGroupButton: false // Players can never be grouped
                });
            });
        } else {
            // Creatures: can be grouped
            const isGrouped = groupByName[nameOrigin];
            
            if (isGrouped && members.length > 1) {
                // Agrupados: una sola entrada para todo el grupo
                displayList.push({
                name: firstMember.name,
                source: firstMember.source,
                nameOrigin,
                key: nameOrigin, // Usar nameOrigin como key para grupos
                initiative: firstMember.initiative,
                initiativeBonus: firstMember.initiativeBonus,
                speed: firstMember.speed,
                senses: firstMember.senses,
                groupMembers: members,
                showGroupButton: true
                });
            } else {
                // No agrupados: entrada individual para cada miembro
                members.forEach(member => {
                displayList.push({
                    name: member.name,
                    source: member.source,
                    nameOrigin: nameOrigin, // Mantener el nameOrigin original para el toggle
                    key: `${nameOrigin}-${member.id}`, // Key único para cada combatiente individual
                    initiative: member.initiative,
                    initiativeBonus: member.initiativeBonus,
                    speed: member.speed,
                    senses: member.senses,
                    groupMembers: [member],
                    showGroupButton: members.length > 1 // Mostrar botón si hay múltiples miembros del mismo tipo
                });
                });
            }
        }
    });
    
    // 4. Ordenar según el estado del combate
    if (isCombatStarted) {
        // Si el combate está iniciado, ordenar por iniciativa (descendente)
        displayList.sort((a, b) => b.initiative - a.initiative);
    }
    // Si no está iniciado, mantener el orden de ingreso (no ordenar)
    
    return displayList;
};

export const loadCachedTokenUrl = async (
    tokenUrl: string | undefined, 
    source: string, 
    name: string
): Promise<string | undefined> => {
    if (!tokenUrl || !source || !name) return undefined;
    
    try {
        // Only load token for display, not full image
        const cachedToken = await getCachedTokenUrl(source, name);
        if (cachedToken)
            return cachedToken;
        
        // If not cached, return the original token URL
        const encodedName = encodeURIComponent(name);
        return `https://5e.tools/img/bestiary/tokens/${source}/${encodedName}.webp`;
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
