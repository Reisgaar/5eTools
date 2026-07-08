import { Redirect } from 'expo-router';

// The `(tabs)` group is path-transparent and the first tab now lives at `/home`, so the root
// path `/` has no screen of its own. Redirect it into the tabs (Home) to avoid an
// "unmatched route" on cold start / reload.
export default function Index() {
    return <Redirect href="/home" />;
}
