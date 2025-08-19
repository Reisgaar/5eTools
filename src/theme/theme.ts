export type Theme = {
    background: string;
    innerBackground: string;
    text: string;
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
    tabBorder: string;
    border: string;
  };

export const lightTheme: Theme = {
    background: '#eeeeee',
    innerBackground: '#dddddd',
    text: '#000000',
    headerText: '#ffffff',
    headerBackground: '#5e60ce',
    buttonBackground: '#5e60ce',
    buttonText: '#fffff',
    inputBackground: '#ffffff',
    linkColor: '#2563eb',
    noticeText: '#444444',
    confirmButtonBackground: '#38b000',
    disabledButtonBackground: '#cccccc',
    primary: '#5e60ce',
    secondary: '#999999',
    card: '#ffffff',
    cardTitle: '#ffffff',
    cardText: '#cccccc',
    storyBackground: '#dddddd',
    storyText: '#000000',
    modelBackground: '#eeeeee',
    tabBackground: '#ffffff',
    tabBorder: '#aaaaaa',
    border: '#dddddd',
};

export const darkTheme: Theme = {
    background: '#121212',
    innerBackground: '#333333',
    text: '#ffffff',
    headerText: '#ffffff',
    headerBackground: '#5e60ce',
    buttonBackground: '#5e60ce',
    buttonText: '#ffffff',
    inputBackground: '#222222',
    linkColor: '#60a5fa',
    noticeText: '#888888',
    confirmButtonBackground: '#38b000',
    disabledButtonBackground: '#2d6a05',
    primary: '#5e60ce',
    secondary: '#999999',
    card: '#1E1E1E',
    cardTitle: '#ffffff',
    cardText: '#cccccc',
    storyBackground: '#222222',
    storyText: '#eeeeee',
    modelBackground: '#eeeeee',
    tabBackground: '#111111',
    tabBorder: '#777777',
    border: '#333333',
};
