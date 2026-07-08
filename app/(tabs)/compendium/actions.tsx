import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function ActionsScreen() {
    const { actions } = useData();
    return <ContentListScreen items={actions} category="action" searchPlaceholder="Search actions..." />;
}
