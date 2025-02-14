import { derived, get, writable } from "svelte/store";

const STORAGE_PREFERENCES_KEY = 'preferences';

const NUMBER_OF_RECENT_TAGS_KEY = `${STORAGE_PREFERENCES_KEY}.numberOfRecentTags`;
const NON_WORK_TAGS_KEY = `${STORAGE_PREFERENCES_KEY}.nonWorkTags`;
const PINNED_TAGS_KEY = `${STORAGE_PREFERENCES_KEY}.pinnedTags`;
const TICKET_BASE_URL_KEY = `${STORAGE_PREFERENCES_KEY}.ticketBaseUrl`;

export class PreferencesService {
    private preferences = writable({
        nonWorkTags: new Set<string>(this.getArray(NON_WORK_TAGS_KEY))
    });
    nonWorkTags = derived(this.preferences, preferences => preferences.nonWorkTags)

    getNumberOfDisplayedTags(defaultValue: number): number {
        const storedValue = localStorage.getItem(NUMBER_OF_RECENT_TAGS_KEY);
        if (storedValue !== null) {
            const parsedStoredValue = parseInt(storedValue);
            if (!isNaN(parsedStoredValue)) {
                return parsedStoredValue;
            }
        }
        return defaultValue;
    }

    getNonWorkTags(): Set<string> {
        return get(this.preferences).nonWorkTags;
    }

    getPinnedTags(): Set<string> {
        return new Set<string>(this.getArray(PINNED_TAGS_KEY));
    }

    getTicketBaseUrl(): string | null {
        return localStorage.getItem(TICKET_BASE_URL_KEY);
    }

    private getArray<T>(key: string): T[] {
        return JSON.parse(localStorage.getItem(key) ?? "[]");
    }
}