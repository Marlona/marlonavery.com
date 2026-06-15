/**
 * Ambient types for the deep import `pdf-parse/lib/pdf-parse.js`.
 *
 * We import the library entrypoint (not the package main) because pdf-parse's
 * index.js runs debug code when it can't find a parent module — which happens
 * under ESM/tsx and crashes on import. The deep path has no such block, but it
 * also ships no type declarations (@types/pdf-parse only types the main entry).
 */
declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFParseResult {
    text: string;
    numpages: number;
    numrender: number;
    info: unknown;
    metadata: unknown;
    version: string;
  }
  function pdfParse(
    data: Buffer | Uint8Array,
    options?: Record<string, unknown>
  ): Promise<PDFParseResult>;
  export default pdfParse;
}
