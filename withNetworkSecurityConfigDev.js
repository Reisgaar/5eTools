// File needed to allow http requests on dev for Android.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withNetworkSecurityConfigDev(config) {
    return withAndroidManifest(config, (config) => {
        if (!config.modResults.manifest.application[0].$) {
            config.modResults.manifest.application[0].$ = {};
        }

        config.modResults.manifest.application[0].$[
            'android:networkSecurityConfig'
        ] = '@xml/network_security_config';

        return config;
    });
};