export function replaceAt(
	line: string,
	replacement: string,
	index: number
): string {
	line = line.slice(0, index) + replacement + line.slice(index + 1);
	return line;
}
