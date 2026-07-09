import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function DeitiesScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('deity')} category="deity" searchPlaceholder="Search deities..." />;
}
