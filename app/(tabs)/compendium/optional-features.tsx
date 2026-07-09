import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function OptionalFeaturesScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('optfeature')} category="optfeature" searchPlaceholder="Search optional features..." />;
}
