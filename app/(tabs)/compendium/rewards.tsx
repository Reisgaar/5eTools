import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function RewardsScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('reward')} category="reward" searchPlaceholder="Search rewards..." />;
}
