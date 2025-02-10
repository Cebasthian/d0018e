export function parseNumber(str: string | null, fallback?: number): number | undefined {
    if(str === null) {
        return fallback || undefined;
    }
    
    const nr = parseInt(str)
    if(!isNaN(nr)) {
        return nr;
    }
    return fallback || undefined;
}

export const SearchParamsUtils = {
    parseInt: parseNumber
}