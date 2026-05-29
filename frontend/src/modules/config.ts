const params = new URLSearchParams(location.search);

function getColor(name: string, defaultValue: string): string {
    const value = params.get(name);
    if (value && /^[0-9A-Fa-f]+$/.test(value)) {
        return `#${value}`;
    }
    return defaultValue;
}

function getInvite(): string | null {
    const invite = params.get('invite');
    if (invite && /^[\w-]+$/.test(invite)) {
        return `https://discord.gg/${invite}`;
    }
    return null;
}

export default {
    theme: {
        primary: getColor('primary', '#fff'),
        accent: getColor('accent', '#5865F2'),
        background: getColor('background', '#36393E')
    },
    invite: getInvite()
};
