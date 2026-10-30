import { expect, test } from "vitest";
import { extractTicketReferences, splitTag, ticketUrl } from "./ticket-link";
import type { TicketMapping } from "./ticket-link";

const MAPPINGS: TicketMapping[] = [
    { project: "proj", path: "foo/bar/baz/-/" },
    { project: "other", path: "foo/foo/foo/-/" },
];

test("extractTicketReferences() should return empty array for tags without references", () => {
    expect(extractTicketReferences("")).toEqual([]);
    expect(extractTicketReferences("Heavy work")).toEqual([]);
    expect(extractTicketReferences("issue #4")).toEqual([]);
});

test("extractTicketReferences() should extract a single reference", () => {
    expect(extractTicketReferences("fix proj#4")).toEqual([
        { reference: "proj#4", project: "proj", number: "4" },
    ]);
});

test("extractTicketReferences() should extract multiple references", () => {
    expect(extractTicketReferences("proj#4 and other#47")).toEqual([
        { reference: "proj#4", project: "proj", number: "4" },
        { reference: "other#47", project: "other", number: "47" },
    ]);
});

test("ticketUrl() should build url from base url, project path and number", () => {
    expect(ticketUrl("proj#4", "https://ticket.com", MAPPINGS)).toBe("https://ticket.com/foo/bar/baz/-/4");
    expect(ticketUrl("other#47", "https://ticket.com", MAPPINGS)).toBe("https://ticket.com/foo/foo/foo/-/47");
});

test("ticketUrl() should not depend on trailing slash of base url", () => {
    expect(ticketUrl("proj#4", "https://ticket.com/", MAPPINGS)).toBe("https://ticket.com/foo/bar/baz/-/4");
});

test("ticketUrl() should not depend on leading slash of path", () => {
    expect(ticketUrl("proj#4", "https://ticket.com", [ { project: "proj", path: "/foo/bar/baz/-/" } ]))
        .toBe("https://ticket.com/foo/bar/baz/-/4");
});

test("ticketUrl() should find mappings case insensitively", () => {
    expect(ticketUrl("PROJ#4", "https://ticket.com", MAPPINGS)).toBe("https://ticket.com/foo/bar/baz/-/4");
});

test("ticketUrl() should use full urls of mappings as is", () => {
    expect(ticketUrl("blah#12", "https://ticket.com", [ { project: "blah", path: "https://tickets.com/foo/" } ]))
        .toBe("https://tickets.com/foo/12");
});

test("ticketUrl() should return null for unmapped projects", () => {
    expect(ticketUrl("unknown#1", "https://ticket.com", MAPPINGS)).toBeNull();
});

test("ticketUrl() should return null for relative paths without base url", () => {
    expect(ticketUrl("proj#4", "", MAPPINGS)).toBeNull();
});

test("ticketUrl() should return null for references without number", () => {
    expect(ticketUrl("proj", "https://ticket.com", MAPPINGS)).toBeNull();
});

test("splitTag() should return a single plain segment for tags without references", () => {
    expect(splitTag("Heavy work", "https://ticket.com", MAPPINGS)).toEqual([
        { text: "Heavy work", url: null },
    ]);
});

test("splitTag() should return a single link segment when the tag is a reference", () => {
    expect(splitTag("proj#4", "https://ticket.com", MAPPINGS)).toEqual([
        { text: "proj#4", url: "https://ticket.com/foo/bar/baz/-/4" },
    ]);
});

test("splitTag() should separate surrounding text and references", () => {
    expect(splitTag("fix proj#4 today", "https://ticket.com", MAPPINGS)).toEqual([
        { text: "fix ", url: null },
        { text: "proj#4", url: "https://ticket.com/foo/bar/baz/-/4" },
        { text: " today", url: null },
    ]);
});

test("splitTag() should separate multiple references", () => {
    expect(splitTag("proj#4 + other#47", "https://ticket.com", MAPPINGS)).toEqual([
        { text: "proj#4", url: "https://ticket.com/foo/bar/baz/-/4" },
        { text: " + ", url: null },
        { text: "other#47", url: "https://ticket.com/foo/foo/foo/-/47" },
    ]);
});

test("splitTag() should keep unmapped references plain", () => {
    expect(splitTag("unknown#1", "https://ticket.com", MAPPINGS)).toEqual([
        { text: "unknown#1", url: null },
    ]);
});

test("splitTag() should keep references plain without base url", () => {
    expect(splitTag("proj#4", "", MAPPINGS)).toEqual([
        { text: "proj#4", url: null },
    ]);
});
