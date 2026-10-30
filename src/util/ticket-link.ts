export interface TicketReference {
    reference: string;
    project: string;
    number: string;
}

export interface TicketMapping {
    project: string;
    path: string;
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

function joinUrl(base: string, path: string): string {
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${normalizedBase}/${normalizedPath}`;
}
