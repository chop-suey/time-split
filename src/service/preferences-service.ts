const LOCAL_STORAGE_PREFERENCES_KEY = 'preferences';

export class PreferencesService {
    getNonWorkTags(): Set<string> {
        const storageKey = `${LOCAL_STORAGE_PREFERENCES_KEY}.nonWorkTags`;
        const nonWorkTags = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
        return new Set<string>(nonWorkTags);
    }

    getTicketBaseUrl(): string | null {
        const storageKey = `${LOCAL_STORAGE_PREFERENCES_KEY}.ticketBaseUrl`;
        return localStorage.getItem(storageKey);
    }
}