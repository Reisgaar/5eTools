import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function ObjectsScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('object')} category="object" searchPlaceholder="Search objects..." />;
}
