export interface TicketReference {
    reference: string;
    project: string;
    number: string;
}

export interface TicketMapping {
    project: string;
    path: string;
}

export interface TagSegment {
    text: string;
    url: string | null;
}

const TICKET_REFERENCE_PATTERN = /([a-zA-Z]+)#(\d+)/g;

export function extractTicketReferences(tag: string): TicketReference[] {
    return [ ...tag.matchAll(TICKET_REFERENCE_PATTERN) ]
        .map(match => ({
            reference: match[0],
            project: match[1],
            number: match[2],
        }));
}

export function ticketUrl(reference: string, baseUrl: string, mappings: TicketMapping[]): string | null {
    const [ ticketReference ] = extractTicketReferences(reference);
    if (!ticketReference) {
        return null;
    }
    const mapping = mappings
        .find(mapping => mapping.project.toLowerCase() === ticketReference.project.toLowerCase());
    if (!mapping) {
        return null;
    }
    let prefix: string;
    if (mapping.path.startsWith("http")) {
        prefix = mapping.path;
    } else {
        const base = baseUrl.trim();
        if (base.length === 0) {
            return null;
        }
        prefix = joinUrl(base, mapping.path);
    }
    return `${prefix}${ticketReference.number}`;
}

export function splitTag(tag: string, baseUrl: string, mappings: TicketMapping[]): TagSegment[] {
    const segments: TagSegment[] = [];
    let lastIndex = 0;
    for (const match of tag.matchAll(TICKET_REFERENCE_PATTERN)) {
        const index = match.index;
        if (index > lastIndex) {
            segments.push({ text: tag.slice(lastIndex, index), url: null });
        }
        segments.push({ text: match[0], url: ticketUrl(match[0], baseUrl, mappings) });
        lastIndex = index + match[0].length;
    }
    if (lastIndex < tag.length) {
        segments.push({ text: tag.slice(lastIndex), url: null });
    }
    return segments;
}

function joinUrl(base: string, path: string): string {
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${normalizedBase}/${normalizedPath}`;
}
