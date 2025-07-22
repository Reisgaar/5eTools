// File needed to allow http requests on dev for iOS.
module.exports = function withHttpAllowedPlistPlugin(config) {
    return {
        ...config,
        ios: {
            ...config.ios,
            infoPlist: {
                ...(config.ios?.infoPlist ?? {}),
                NSAppTransportSecurity: {
                    NSAllowsArbitraryLoads: true,
                },
            },
        },
    };
};