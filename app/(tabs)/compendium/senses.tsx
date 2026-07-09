import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function SensesScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('sense')} category="sense" searchPlaceholder="Search senses..." />;
}
