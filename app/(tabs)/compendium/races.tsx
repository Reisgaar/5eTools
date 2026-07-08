import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function RacesScreen() {
    const { races } = useData();
    return <ContentListScreen items={races} category="race" searchPlaceholder="Search races..." />;
}
