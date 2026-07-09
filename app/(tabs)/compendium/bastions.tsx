import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function BastionsScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('facility')} category="facility" searchPlaceholder="Search bastions..." />;
}
