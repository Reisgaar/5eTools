import ContentListScreen from 'src/components/compendium/ContentListScreen';
import { useData } from 'src/context/DataContext';

export default function ClassesScreen() {
    const { classes } = useData();
    return <ContentListScreen items={classes} category="class" searchPlaceholder="Search classes..." />;
}
