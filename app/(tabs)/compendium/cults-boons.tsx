import React from 'react';
import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function CultsBoonsScreen() {
    const { getContentList } = useData();
    const items = React.useMemo(() => [
        ...getContentList('cult').map((x: any) => ({ ...x, __cat: 'cult' })),
        ...getContentList('boon').map((x: any) => ({ ...x, __cat: 'boon' })),
    ], [getContentList]);
    return (
        <ContentListScreen
            items={items}
            category="cult"
            categoryOf={(i) => i.__cat}
            searchPlaceholder="Search cults & boons..."
        />
    );
}
