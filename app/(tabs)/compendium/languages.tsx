import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function LanguagesScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('language')} category="language" searchPlaceholder="Search languages..." />;
}
