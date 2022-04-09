import { PreferencesService } from "./preferences-service";
import { TimeSplitService } from "./time-split-service";

let timeSplitService: TimeSplitService;

export function getTimeSplitService(): TimeSplitService {
    if (!timeSplitService) {
        timeSplitService = new TimeSplitService();
    }
    return timeSplitService;
}

let preferencesService: PreferencesService;

export function getPreferencesService(): PreferencesService {
    if (!preferencesService) {
        preferencesService = new PreferencesService();
    }
    return preferencesService;
}