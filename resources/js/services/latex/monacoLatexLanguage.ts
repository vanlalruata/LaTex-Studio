import * as monaco from 'monaco-editor';

let registered = false;

export function registerLatexLanguage(): void {
    if (registered) {
        return;
    }

    registered = true;

    monaco.languages.register({
        id: 'latex',
        extensions: ['.tex', '.sty', '.cls', '.ltx'],
        aliases: ['LaTeX', 'TeX'],
    });

    monaco.languages.setLanguageConfiguration('latex', {
        comments: {
            lineComment: '%',
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '$', close: '$' },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '$', close: '$' },
        ],
    });

    monaco.languages.setMonarchTokensProvider('latex', {
        tokenizer: {
            root: [
                [/%.*$/, 'comment'],
                [/\\(?:begin|end)\{[^}]*\}/, 'keyword.control'],
                [
                    /\\(?:documentclass|usepackage|title|author|date|maketitle|section|subsection|subsubsection|chapter|part|label|ref|eqref|cite|input|include|includegraphics|bibliography|addbibresource|printbibliography|tableofcontents)\b/,
                    'keyword',
                ],
                [/\\[a-zA-Z@]+/, 'tag'],
                [/\\[^a-zA-Z]/, 'tag'],
                [/\$\$/, { token: 'string.math', next: '@mathDisplay' }],
                [/\$/, { token: 'string.math', next: '@mathInline' }],
                [/[{}[\]()]/, 'delimiter.bracket'],
                [/[0-9]+/, 'number'],
            ],
            mathInline: [
                [/\$/, { token: 'string.math', next: '@pop' }],
                [/\\[a-zA-Z]+/, 'variable.math'],
                [/[^$\\]+/, 'string.math'],
            ],
            mathDisplay: [
                [/\$\$/, { token: 'string.math', next: '@pop' }],
                [/\\[a-zA-Z]+/, 'variable.math'],
                [/[^$\\]+/, 'string.math'],
            ],
        },
    });

    monaco.editor.defineTheme('latex-studio-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
            { token: 'keyword.control', foreground: '0f766e', fontStyle: 'bold' },
            { token: 'keyword', foreground: '7c2d12', fontStyle: 'bold' },
            { token: 'tag', foreground: '1d4ed8' },
            { token: 'string.math', foreground: '9333ea' },
            { token: 'variable.math', foreground: '6d28d9' },
        ],
        colors: {
            'editor.background': '#ffffff',
            'editorLineNumber.foreground': '#94a3b8',
            'editorLineNumber.activeForeground': '#0f172a',
            'editor.lineHighlightBackground': '#f8fafc',
        },
    });
}

export function inferMonacoLanguage(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase() ?? '';

    switch (ext) {
        case 'tex':
        case 'sty':
        case 'cls':
        case 'ltx':
        case 'bib':
            return 'latex';
        case 'md':
            return 'markdown';
        case 'json':
            return 'json';
        case 'py':
            return 'python';
        default:
            return 'plaintext';
    }
}
