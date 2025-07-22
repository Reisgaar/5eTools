// Constants to update on production builds.
const version = '1.0.3';
const buildNumber = 8;   // +1 on each production build.

// App identification constants.
const appName = '5e tools';             // Display name shown under the app icon on the device.
const identifier = 'dnd.5eTools';       // Bundle identifier (iOS) and package name (Android). Must be unique and reverse-DNS formatted.
const slug = '5etools';            // Unique project identifier used by Expo and EAS, must be URL-friendly.
const scheme = 'dndtools';               // Custom URI scheme used for deep linking, must be unique across apps to avoid conflicts on devices.

// Android SDK version. Must be updated regularly to meet Google Play requirements.
const androidSdkVersion = 35;

// Project id is linked to expo.dev account project.
const projectId = '1ddd7043-f41e-4abe-96bd-ccc5948e57a2';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withNetworkSecurityConfigDev = require('./withNetworkSecurityConfigDev');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withHttpAllowedPlistPlugin = require('./withHttpAllowedPlistPlugin.cjs');

const plugins = [
    'expo-router',
    'expo-localization'
];

export default {
    expo: {
        name: appName,
        slug: slug,
        version: version,
        orientation: 'portrait',
        icon: './assets/images/logo_and_name.png',
        scheme: scheme,
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        ios: {
            version: version,
            buildNumber: buildNumber.toString(), // Has to be string for iOS.
            supportsTablet: true,
            bundleIdentifier: identifier,
            name: appName,
            icon: './assets/images/logo_and_name.png',
            infoPlist: {
                CFBundleDisplayName: appName,
                ITSAppUsesNonExemptEncryption: false,
                NSPhotoLibraryAddUsageDescription: 'To save files or exported data to your media library.',
                NSDocumentsFolderUsageDescription: 'Used to store and access data in the local device storage.'
            }
        },
        android: {
            version: version,
            name: appName,
            versionCode: buildNumber, // Has to be number for Android.
            compileSdkVersion: androidSdkVersion,
            targetSdkVersion: androidSdkVersion,
            icon: './assets/images/logo_and_name.png',
            adaptiveIcon: {
                backgroundColor: '#ffffff'
            },
            permissions: [
                "android.permission.INTERNET",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE"
            ],
            package: 'com.dnd.dndtools',
            resourceFiles: ['./assets/network_security_config.xml'],
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.ico'
        },
        plugins: plugins,
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {
                origin: false
            },
            eas: {
                projectId: projectId
            }
        }
    }
};