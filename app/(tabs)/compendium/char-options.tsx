import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function CharOptionsScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('charoption')} category="charoption" searchPlaceholder="Search character options..." />;
}
