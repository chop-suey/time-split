import { LocalStorageTimeSplitService } from "./local-storage-time-split-service";
import { PreferencesService } from "./preferences-service";
import type { TimeSplitService } from "./time-split-service";
import { TimeSplitStore } from "./time-split-store";

let timeSplitStore: TimeSplitStore;
let timeSplitService: TimeSplitService;

export function getTimeSplitService(): TimeSplitService {
    if (!timeSplitService) {
        timeSplitService = new LocalStorageTimeSplitService();
    }
    return timeSplitService;
}

export function getTimeSplitStore(): TimeSplitStore {
    if (!timeSplitStore) {
        timeSplitStore = new TimeSplitStore(getTimeSplitService());
    }
    return timeSplitStore;
}

let preferencesService: PreferencesService;

export function getPreferencesService(): PreferencesService {
    if (!preferencesService) {
        preferencesService = new PreferencesService();
    }
    return preferencesService;
}