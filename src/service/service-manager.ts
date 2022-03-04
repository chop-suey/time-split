import { TimeSplitService } from "./time-split-service";

let timeSplitService: TimeSplitService;

export function getTimeSplitService(): TimeSplitService {
    if (!timeSplitService) {
        timeSplitService = new TimeSplitService();
    }
    return timeSplitService;
}