export type Theme = {
    background: string;
    innerBackground: string;
    text: string;
    textInverse: string;
    headerText: string;
    headerBackground: string;
    buttonBackground: string;
    buttonText: string;
    inputBackground: string;
    linkColor: string;
    noticeText: string;
    confirmButtonBackground: string;
    disabledButtonBackground: string;
    primary: string;
    secondary: string;
    card: string;
    cardTitle: string;
    cardText: string;
    storyBackground: string;
    storyText: string;
    modelBackground: string;
    tabBackground: string;
    tabActive: string;
    tabInactive: string;
    tabBorder: string;
    border: string;
    settingsContainer: string;
    settingsButton: string;
    combatControls: string;
  };

// Palette: warm parchment/ink surfaces (thematic fantasy) with an arcane-sapphire blue accent.
// Blue-on-warm reads like ink on parchment — modern, cohesive, and single-accent throughout.
export const lightTheme: Theme = {
    background: '#F3EDE0',          // warm paper
    innerBackground: '#EAE3D3',
    text: '#2A2620',                // warm ink
    textInverse: '#FFFFFF',
    headerText: '#2A2620',
    headerBackground: '#FBF7EE',
    buttonBackground: '#3B6FE0',    // arcane blue
    buttonText: '#FFFFFF',
    inputBackground: '#FCF9F2',
    linkColor: '#2B5FD0',
    noticeText: '#6B6459',          // warm muted
    confirmButtonBackground: '#2FA36B',
    disabledButtonBackground: '#D9D2C4',
    primary: '#3B6FE0',
    secondary: '#9A9082',
    card: '#FCF9F2',                // warm off-white
    cardTitle: '#2A2620',
    cardText: '#6B6459',
    storyBackground: '#EFE8DA',
    storyText: '#2A2620',
    modelBackground: '#FCF9F2',
    tabBackground: '#FCF9F2',
    tabActive: '#3B6FE0',
    tabInactive: '#9A9082',
    tabBorder: '#E3DBCB',
    border: '#E3DBCB',
    settingsContainer: '#FCF9F2',
    settingsButton: '#EFE8DA',
    combatControls: '#6B6459',
};

export const darkTheme: Theme = {
    background: '#191712',          // warm near-black
    innerBackground: '#221F19',
    text: '#EDE6D6',                // parchment text
    textInverse: '#191712',
    headerText: '#EDE6D6',
    headerBackground: '#221F19',
    buttonBackground: '#3B6FE0',    // arcane blue
    buttonText: '#FFFFFF',
    inputBackground: '#221F19',
    linkColor: '#6B94FF',
    noticeText: '#A69C88',          // warm muted
    confirmButtonBackground: '#2FA36B',
    disabledButtonBackground: '#3A352C',
    primary: '#3B6FE0',
    secondary: '#8A8172',
    card: '#232019',               // warm elevated surface
    cardTitle: '#EDE6D6',
    cardText: '#A69C88',
    storyBackground: '#1F1C16',
    storyText: '#EDE6D6',
    modelBackground: '#232019',
    tabBackground: '#232019',
    tabActive: '#6B94FF',
    tabInactive: '#8A8172',
    tabBorder: '#322D26',
    border: '#322D26',
    settingsContainer: '#232019',
    settingsButton: '#2A261F',
    combatControls: '#A69C88',
};
