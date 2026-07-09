import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function VehiclesScreen() {
    const { getContentList } = useData();
    return <ContentListScreen items={getContentList('vehicle')} category="vehicle" searchPlaceholder="Search vehicles..." />;
}
