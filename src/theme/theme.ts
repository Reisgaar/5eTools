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
    background: '#eee',
    innerBackground: '#ddd',
    text: '#000',
    headerText: '#fff',
    headerBackground: '#5e60ce',
    buttonBackground: '#5e60ce',
    buttonText: '#fff',
    inputBackground: '#fff',
    linkColor: '#2563eb',
    noticeText: '#444',
    confirmButtonBackground: '#38b000',
    disabledButtonBackground: '#cccccc',
    primary: '#5e60ce',
    card: '#ffffff',
    cardTitle: '#fff',
    cardText: '#ccc',
    storyBackground: '#ddd',
    storyText: '#000',
    modelBackground: '#eee',
    tabBackground: '#fff',
    tabBorder: '#aaa',
    border: '#ddd',
};

export const darkTheme: Theme = {
    background: '#121212',
    innerBackground: '#333',
    text: '#fff',
    headerText: '#fff',
    headerBackground: '#5e60ce',
    buttonBackground: '#5e60ce',
    buttonText: '#fff',
    inputBackground: '#222',
    linkColor: '#60a5fa',
    noticeText: '#888',
    confirmButtonBackground: '#38b000',
    disabledButtonBackground: '#2d6a05',
    primary: '#5e60ce',
    card: '#1E1E1E',
    cardTitle: '#fff',
    cardText: '#ccc',
    storyBackground: '#222',
    storyText: '#eee',
    modelBackground: '#eee',
    tabBackground: '#111',
    tabBorder: '#777',
    border: '#333',
};
