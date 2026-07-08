// Base URL for on-demand data fetched from the app's own GitHub repo (so the app doesn't
// depend on 5e.tools staying online). The book/adventure JSON files live under this path and
// are downloaded + cached to disk on demand rather than bundled into the app.
//
// NOTE: the referenced files must be committed AND pushed to this branch for the URLs to
// resolve (raw.githubusercontent.com serves the pushed contents of a public repo).
export const GITHUB_DATA_BASE =
    'https://raw.githubusercontent.com/Reisgaar/5eTools/main/src/data/data';

/** URL for a full book's content file (e.g. id "PHB" → …/book/book-phb.json). */
export const bookContentUrl = (id: string): string =>
    `${GITHUB_DATA_BASE}/book/book-${id.toLowerCase()}.json`;

/** URL for a full adventure's content file (e.g. id "LMoP" → …/adventure/adventure-lmop.json). */
export const adventureContentUrl = (id: string): string =>
    `${GITHUB_DATA_BASE}/adventure/adventure-${id.toLowerCase()}.json`;
