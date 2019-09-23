export function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export function firstLetter(s: string): string {
    return capitalize(s.charAt(0).toUpperCase())
}