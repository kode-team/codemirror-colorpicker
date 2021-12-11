function isSupported(api, apiParent) {
    return (api in apiParent);
}

export const enableEyeDropper = isSupported('EyeDropper', window);