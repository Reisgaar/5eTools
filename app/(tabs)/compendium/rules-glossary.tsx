import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function RulesGlossaryScreen() {
    const { variantRules } = useData();
    return <ContentListScreen items={variantRules} category="variantrule" searchPlaceholder="Search rules..." />;
}
