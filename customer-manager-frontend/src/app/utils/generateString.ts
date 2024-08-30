export function generateCode (label:string, date: Date, sequence: number): string {
    const year = date.getFullYear();
    return `${label}_${year}${sequence.toString().padStart(8, '0')}`;
}