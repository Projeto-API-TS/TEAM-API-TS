export const validateName = (name: string): boolean => {
    const trimmedName = name.replace(/\s+/g, "");
    if (trimmedName.length < 3) {
        return false;
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return nameRegex.test(name);
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
        return false;
    }
    const hasLetterRegex = /[A-Za-z]/;
    const hasNumberRegex = /[0-9]/;
    return hasLetterRegex.test(password) && hasNumberRegex.test(password);
};

export const validateUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

export const validateUsername = (username: string): boolean => {
    if (username.length < 1 || username.length > 30) {
        return false;
    }
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    return usernameRegex.test(username);
};

export const validateTeamName = (teamName: string): boolean => {
    if (teamName.length < 3 || teamName.length > 30) {
        return false;
    }
    const teamNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return teamNameRegex.test(teamName);
};