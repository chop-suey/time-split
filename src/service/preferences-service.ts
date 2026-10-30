import { derived, writable } from "svelte/store";
import type { Readable } from "svelte/store";

const STORAGE_PREFERENCES_KEY = 'preferences';

const NUMBER_OF_RECENT_TAGS_KEY = `${STORAGE_PREFERENCES_KEY}.numberOfRecentTags`;
const NON_WORK_TAGS_KEY = `${STORAGE_PREFERENCES_KEY}.nonWorkTags`;
const PINNED_TAGS_KEY = `${STORAGE_PREFERENCES_KEY}.pinnedTags`;
const TICKET_BASE_URL_KEY = `${STORAGE_PREFERENCES_KEY}.ticketBaseUrl`;

const DEFAULT_NUMBER_OF_RECENT_TAGS = 10;

interface Preferences {
    nonWorkTags: Set<string>;
    pinnedTags: Set<string>;
    ticketBaseUrl: string;
    numberOfRecentTags: number;
}

export class PreferencesService {
    private readonly preferences = writable<Preferences>(this.loadPreferences());

    nonWorkTags: Readable<Set<string>> = derived(this.preferences, preferences => preferences.nonWorkTags);
    pinnedTags: Readable<Set<string>> = derived(this.preferences, preferences => preferences.pinnedTags);
    ticketBaseUrl: Readable<string> = derived(this.preferences, preferences => preferences.ticketBaseUrl);
    numberOfRecentTags: Readable<number> = derived(this.preferences, preferences => preferences.numberOfRecentTags);

    constructor() {
        this.preferences.subscribe(preferences => this.storePreferences(preferences));
    }

    setNonWorkTags(tags: Set<string>): void {
        this.preferences.update(preferences => ({ ...preferences, nonWorkTags: new Set(tags) }));
    }

    setPinnedTags(tags: Set<string>): void {
        this.preferences.update(preferences => ({ ...preferences, pinnedTags: new Set(tags) }));
    }

    setTicketBaseUrl(url: string): void {
        this.preferences.update(preferences => ({ ...preferences, ticketBaseUrl: url }));
    }

    setNumberOfRecentTags(count: number): void {
        this.preferences.update(preferences => ({ ...preferences, numberOfRecentTags: count }));
    }

    private loadPreferences(): Preferences {
        return {
            nonWorkTags: new Set<string>(this.getArray(NON_WORK_TAGS_KEY)),
            pinnedTags: new Set<string>(this.getArray(PINNED_TAGS_KEY)),
            ticketBaseUrl: localStorage.getItem(TICKET_BASE_URL_KEY) ?? "",
            numberOfRecentTags: this.loadNumberOfRecentTags()
        };
    }

    private storePreferences(preferences: Preferences): void {
        localStorage.setItem(NUMBER_OF_RECENT_TAGS_KEY, String(preferences.numberOfRecentTags));
        localStorage.setItem(NON_WORK_TAGS_KEY, JSON.stringify([ ...preferences.nonWorkTags ]));
        localStorage.setItem(PINNED_TAGS_KEY, JSON.stringify([ ...preferences.pinnedTags ]));
        localStorage.setItem(TICKET_BASE_URL_KEY, preferences.ticketBaseUrl);
    }

    private loadNumberOfRecentTags(): number {
        const storedValue = parseInt(localStorage.getItem(NUMBER_OF_RECENT_TAGS_KEY) ?? "");
        return isNaN(storedValue) ? DEFAULT_NUMBER_OF_RECENT_TAGS : storedValue;
    }

    private getArray<T>(key: string): T[] {
        return JSON.parse(localStorage.getItem(key) ?? "[]");
    }
}
