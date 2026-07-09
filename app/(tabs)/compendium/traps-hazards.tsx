import React from 'react';
import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function TrapsHazardsScreen() {
    const { getContentList } = useData();
    const items = React.useMemo(() => [
        ...getContentList('trap').map((x: any) => ({ ...x, __cat: 'trap' })),
        ...getContentList('hazard').map((x: any) => ({ ...x, __cat: 'hazard' })),
    ], [getContentList]);
    return (
        <ContentListScreen
            items={items}
            category="trap"
            categoryOf={(i) => i.__cat}
            searchPlaceholder="Search traps & hazards..."
        />
    );
}
