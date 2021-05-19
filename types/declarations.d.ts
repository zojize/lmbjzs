declare module '*.pegjs' {
    import type { Parser } from 'peggy';
    export const parse: Parser['parse'];
    export const SyntaxError: Parser['SyntaxError'];
}
