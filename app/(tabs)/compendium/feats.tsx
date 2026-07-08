import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function FeatsScreen() {
    const { feats } = useData();
    return (
        <ContentListScreen
            items={feats}
            category="feat"
            searchPlaceholder="Search feats..."
            getSubtitle={(item) => (typeof item.category === 'string' ? item.category : undefined)}
        />
    );
}
