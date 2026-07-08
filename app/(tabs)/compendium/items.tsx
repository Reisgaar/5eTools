import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';
import { formatItemType } from 'src/utils/itemUtils';

export default function ItemsScreen() {
    const { items } = useData();
    return (
        <ContentListScreen
            items={items}
            category="item"
            searchPlaceholder="Search items..."
            getSubtitle={(item) => formatItemType(item)}
        />
    );
}
