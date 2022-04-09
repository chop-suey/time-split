import { equal } from "assert";
import { describe } from "mocha";
import { Datetime } from "../model/datetime";
import { Timesplit } from "../model/timesplit";
import { extractWorkingHours } from "./working-hours";

function split(tag: string, hourStart: number, minuteStart: number, hourEnd: number = null, minuteEnd: number = null) {
    const start = new Datetime(new Date(2022, 1, 1, hourStart, minuteStart))
    const end = !!hourEnd ? new Datetime(new Date(2022, 1, 1, hourEnd, minuteEnd)) : undefined;
    return new Timesplit(0, tag, start, end)
}

const NON_WORK_TAGS = new Set<string>(['Break', 'Meditation']);

const WORK_8_0_10_0 = split('Ended work', 8, 0, 10, 0);
const WORK_10_0_11_0 = split('Ended work', 10, 0, 11, 0);

const WORK_8_0 = split('Heavy work', 8, 0);
const WORK_10_0 = split('Some more', 10, 0);
const WORK_11_30 = split('More work', 11, 30);
const WORK_13_0 = split('Heavy work', 13, 0);
const WORK_14_0 = split('More work', 14, 0);
const WORK_15_0 = split('Some more', 15, 0);
const WORK_16_0 = split('More work', 16, 0);

const NON_WORK_11_0 = split('Break', 11, 0);
const NON_WORK_12_0 = split('Meditation', 12, 0);
const NON_WORK_13_0 = split('Break', 13, 0);
const NON_WORK_15_0 = split('Meditation', 15, 0);
const NON_WORK_17_0 = split('Meditation', 17, 0);


describe('Working hours util', () => {
    describe('#extractWorkingHours()', () => {
        it('should return empty string when no splits are provided', () => {
            equal(extractWorkingHours(undefined, NON_WORK_TAGS), '');
            equal(extractWorkingHours(null, NON_WORK_TAGS), '');
            equal(extractWorkingHours([], NON_WORK_TAGS), '');
        });
        it('should return start time if only one split without end time is provided', () => {
            equal(extractWorkingHours([WORK_8_0], NON_WORK_TAGS), '08:00');
        });
        it('should return empty string if only non work tags are provided', () => {
            equal(extractWorkingHours([NON_WORK_11_0], NON_WORK_TAGS), '');
            equal(extractWorkingHours([NON_WORK_11_0, NON_WORK_13_0], NON_WORK_TAGS), '');
            equal(extractWorkingHours([NON_WORK_11_0, NON_WORK_13_0, NON_WORK_17_0], NON_WORK_TAGS), '');
        })
        it('should return string with start and end time one split with end time is provided', () => {
            equal(extractWorkingHours([WORK_8_0_10_0], NON_WORK_TAGS), '08:00-10:00');
        });
        it('should return correct working hours if two splits without end time are provided', () => {
            equal(extractWorkingHours([WORK_8_0, WORK_10_0], NON_WORK_TAGS), '08:00-10:00');
        });
        it('should return correct working hours if two splits with end time are provided', () => {
            equal(extractWorkingHours([WORK_8_0_10_0, WORK_10_0_11_0], NON_WORK_TAGS), '08:00-11:00');
        });
        it('should return correct working hours if work splits are followed by non work splits', () => {
            equal(extractWorkingHours([WORK_8_0, NON_WORK_11_0], NON_WORK_TAGS), '08:00-11:00');
            equal(extractWorkingHours([WORK_8_0, NON_WORK_11_0, NON_WORK_12_0], NON_WORK_TAGS), '08:00-11:00');
            equal(extractWorkingHours([WORK_8_0, WORK_10_0, NON_WORK_11_0], NON_WORK_TAGS), '08:00-11:00');
            equal(extractWorkingHours([WORK_8_0, WORK_10_0, NON_WORK_11_0, NON_WORK_12_0], NON_WORK_TAGS), '08:00-11:00');
        });
        it('should return correct working hours for mixed work and non work splits', () => {
            equal(extractWorkingHours([WORK_8_0, NON_WORK_11_0, WORK_11_30], NON_WORK_TAGS), '08:00-11:00-11:30');
            equal(extractWorkingHours([WORK_8_0, NON_WORK_11_0, WORK_11_30, NON_WORK_15_0], NON_WORK_TAGS), '08:00-11:00-11:30-15:00');
            equal(extractWorkingHours([WORK_8_0, WORK_10_0, NON_WORK_11_0, WORK_11_30], NON_WORK_TAGS), '08:00-11:00-11:30');
            equal(extractWorkingHours([WORK_8_0, WORK_10_0, NON_WORK_11_0, WORK_11_30, NON_WORK_15_0], NON_WORK_TAGS), '08:00-11:00-11:30-15:00');
            equal(extractWorkingHours([WORK_8_0, NON_WORK_11_0, NON_WORK_12_0, WORK_14_0], NON_WORK_TAGS), '08:00-11:00-14:00');
            equal(extractWorkingHours([WORK_8_0, NON_WORK_11_0, NON_WORK_12_0, WORK_14_0, WORK_16_0], NON_WORK_TAGS), '08:00-11:00-14:00-16:00');
            equal(extractWorkingHours([NON_WORK_11_0, WORK_11_30], NON_WORK_TAGS), '11:30');
            equal(extractWorkingHours([NON_WORK_11_0, WORK_11_30, NON_WORK_15_0], NON_WORK_TAGS), '11:30-15:00');
            equal(extractWorkingHours([NON_WORK_11_0, NON_WORK_12_0, WORK_13_0, NON_WORK_15_0], NON_WORK_TAGS), '13:00-15:00');
            equal(extractWorkingHours([NON_WORK_11_0, WORK_13_0, WORK_16_0], NON_WORK_TAGS), '13:00-16:00');
            equal(extractWorkingHours([NON_WORK_11_0, WORK_13_0, WORK_16_0, NON_WORK_17_0], NON_WORK_TAGS), '13:00-17:00');
        });
        it('should return correct working hours if splits are not in correct order', () => {
            equal(extractWorkingHours([WORK_13_0, NON_WORK_11_0, WORK_8_0, NON_WORK_17_0, WORK_11_30], NON_WORK_TAGS), '08:00-11:00-11:30-17:00');
        });
        it('should ignore end time if it is not the same day', () => {
            const start = new Datetime(new Date(2022, 1, 1, 16));
            const end = new Datetime(new Date(2022, 1, 2, 8));
            const split = new Timesplit(0, 'Work', start, end);
            equal(extractWorkingHours([split], NON_WORK_TAGS), '16:00');
            equal(extractWorkingHours([WORK_10_0, split], NON_WORK_TAGS), '10:00-16:00');
        });
    });
});