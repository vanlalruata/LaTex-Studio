export interface BibEntry {
    key: string;
    type: string;
    title: string;
    author: string;
    year: string;
    doi: string;
    isDuplicate: boolean;
}

export function parseBibtex(source: string): BibEntry[] {
    const entries: BibEntry[] = [];
    const seenKeys = new Set<string>();

    const entryRegex = /@([a-zA-Z]+)\s*\{\s*([^,\s]+)\s*,([\s\S]*?)\n\}/g;
    let match: RegExpExecArray | null;

    while ((match = entryRegex.exec(source)) !== null) {
        const type = match[1].toLowerCase();
        const key = match[2].trim();
        const body = match[3];

        const extractField = (field: string): string => {
            const fieldRegex = new RegExp(`${field}\\s*=\\s*(?:\\{([\\s\\S]*?)\\}|"([^"]*)")`, 'i');
            const m = body.match(fieldRegex);
            return (m?.[1] ?? m?.[2] ?? '').replace(/\s+/g, ' ').trim();
        };

        const isDuplicate = seenKeys.has(key);
        seenKeys.add(key);

        entries.push({
            key,
            type,
            title: extractField('title') || '(Untitled)',
            author: extractField('author') || 'Unknown author',
            year: extractField('year') || 'n.d.',
            doi: extractField('doi'),
            isDuplicate,
        });
    }

    return entries;
}
