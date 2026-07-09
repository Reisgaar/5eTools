import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function PsionicsScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('psionic')} category="psionic" searchPlaceholder="Search psionics..." />;
}
