import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function SkillsScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('skill')} category="skill" searchPlaceholder="Search skills..." />;
}
