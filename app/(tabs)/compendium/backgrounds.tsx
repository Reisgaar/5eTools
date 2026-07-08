import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function BackgroundsScreen() {
    const { backgrounds } = useData();
    return <ContentListScreen items={backgrounds} category="background" searchPlaceholder="Search backgrounds..." />;
}
