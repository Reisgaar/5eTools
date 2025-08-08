import { Combatant } from '../../context/CombatContext';

export interface CombatGroupData {
  name: string;
  source: string;
  nameOrigin: string;
  initiative: number;
  passivePerception?: number;
  groupMembers: Combatant[];
  showGroupButton: boolean;
}

export interface CombatGroupProps {
  group: CombatGroupData;
  isActive: boolean;
  isGroupEnabled: boolean;
  onToggleGroup: () => void;
  onValueEdit: (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean, combatantNumber?: number) => void;
  onStatusEdit: (id: string, name: string, currentColor?: string, currentCondition?: string) => void;
  onCreaturePress: (name: string, source: string) => void;
  onTokenPress: (tokenUrl: string | undefined, creatureName: string) => void;
  cachedTokenUrls: { [key: string]: string };
  theme: any;
}

export interface CombatIndividualProps {
  combatant: Combatant;
  isActive: boolean;
  canGroup: boolean;
  onToggleGroup: () => void;
  onValueEdit: (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean, combatantNumber?: number) => void;
  onStatusEdit: (id: string, name: string, currentColor?: string, currentCondition?: string) => void;
  onCreaturePress: (name: string, source: string) => void;
  onTokenPress: (tokenUrl: string | undefined, creatureName: string) => void;
  cachedTokenUrls: { [key: string]: string };
  theme: any;
}

export interface CombatMemberProps {
  member: Combatant;
  memberIndex: number;
  isActive: boolean;
  onValueEdit: (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean, combatantNumber?: number) => void;
  onStatusEdit: (id: string, name: string, currentColor?: string, currentCondition?: string) => void;
  onCreaturePress: (name: string, source: string) => void;
  onTokenPress: (tokenUrl: string | undefined, creatureName: string) => void;
  cachedTokenUrls: { [key: string]: string };
  theme: any;
}

export interface CombatHeaderProps {
  combatName: string;
  onBackToList: () => void;
  onStartCombat: () => void;
  onStopCombat: () => void;
  onRandomizeInitiative: () => void;
  onOpenPlayerModal: () => void;
  onResetCombat: () => void;
  started: boolean;
  theme: any;
}

export interface CombatControlsProps {
  started: boolean;
  round: number;
  onStopCombat: () => void;
  onNextTurn: () => void;
  theme: any;
}

export interface CombatListProps {
  combats: Combat[];
  currentCombatId: string | null;
  newCombatName: string;
  onNewCombatNameChange: (name: string) => void;
  onSelectCombat: (combatId: string) => void;
  onCreateCombat: () => void;
  onSetCombatActive: (combatId: string, active: boolean) => void;
  theme: any;
}

export interface Combat {
  id: string;
  name: string;
  createdAt: number;
  combatants: Combatant[];
  isActive?: boolean;
}

export interface CombatSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  beastToAdd: any | null;
  combats: Combat[];
  currentCombatId: string | null;
  newCombatName: string;
  quantity: string;
  onNewCombatNameChange: (name: string) => void;
  onQuantityChange: (quantity: string) => void;
  onSelectCombat: (combatId: string) => void;
  onCreateNewCombat: () => void;
  theme: any;
}

export interface CombatContentProps {
  combatants: Combatant[];
  combatName: string;
  onUpdateHp: (id: string, newHp: number) => void;
  onUpdateMaxHp: (id: string, newMaxHp: number) => void;
  onUpdateAc: (id: string, newAc: number) => void;
  onUpdateInitiative: (id: string, newInit: number) => void;
  onUpdateInitiativeForGroup: (name: string, newInit: number) => void;
  onUpdateColor: (id: string, color: string | null) => void;
  onUpdateConditions: (id: string, conditions: string[]) => void;
  onUpdateNote: (id: string, note: string) => void;
  onRemoveCombatant: (id: string) => void;
  onRandomizeInitiative: () => void;
  onStopCombat: () => void;
  onBackToList: () => void;
  theme: any;
  isGroupEnabled: (nameOrigin: string) => boolean;
  toggleGroupForName: (nameOrigin: string) => void;
  groupByName: { [nameOrigin: string]: boolean };
  round: number;
  turnIndex: number;
  started: boolean;
  onStartCombat: () => void;
  onNextTurn: () => void;
}
