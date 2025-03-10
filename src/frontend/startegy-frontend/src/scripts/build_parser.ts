import { Step } from '../models/strategy_model';
import { replaceAt } from '../../../../global/global_functions';

export function parseBuild(buildString: string): Step[] {
    const steps: Step[] = [];
    const strArr: string[] = buildString.split('\n');

    for (let i = 0; i < strArr.length; i++) {
        let t1 = '';
        let step = '';
        let t2 = '';
        let current = strArr[i];

        const lineResult = checkLine(current);
        t1 = lineResult[0].trim();
        step = lineResult[1].trim();
        t2 = lineResult[2].trim();

        let st = new Step(t1, step, t2 ? t2 : null);
        steps.push(st);
    }

    return steps;
}

function checkLine(currentLine: string): [string, string, string] {
    currentLine = cleanLine(currentLine);
    let t1: string = '';
    let step: string = '';
    let t2: string = '';
    const supplyRegex = /^1[1-9]|^[2-9][0-9]/;
    const atRegex = /^@/;
    const timeRegex = /^~?[0-9]?[0-9][:;'][0-9]{2}/;
    const regexes = [supplyRegex, atRegex, timeRegex];
    let result!: [string, string];

    for (let i = 0; i < 2; i++) {
        let isMatch = regexes.some((rx) => {
            let regexResult = rx.exec(currentLine);
            if (regexResult !== null) {
                switch (rx) {
                    case supplyRegex:
                        result = checkForSupply(currentLine);
                        break;
                    case atRegex:
                        result = checkForAt(currentLine);
                        break;
                    case timeRegex:
                        result = checkForTime(currentLine);
                        break;
                }
                if (t1 !== '') {
                    t2 = result[0];
                    currentLine = cleanLine(result[1]);
                    step = currentLine;
                } else {
                    t1 = result[0];
                    currentLine = cleanLine(result[1]);
                }
            }
            return rx.exec(currentLine);
        });
        if (!isMatch) {
            currentLine = cleanLine(currentLine);
            step = currentLine;
            break;
        }
    }

    return [t1, step, t2];
}

function checkForSupply(currentLine: string): [string, string] {
    let result = '';

    let slashCheck = currentLine.search('/');
    if (slashCheck == 2) {
        result = currentLine.slice(0, 5);
        currentLine = currentLine.slice(5);
    } else {
        result = currentLine.slice(0, 2);
        currentLine = currentLine.slice(2);
    }
    currentLine = cleanLine(currentLine);

    return [result, currentLine];
}

function checkForAt(currentLine: string): [string, string] {
    let result = '';

    const ordinalIndicators = [
        /1st/,
        /1-st/,
        /1 st/,
        /1–st/,
        /2nd/,
        /2-nd/,
        /2–nd/,
        /2 nd/,
        /3rd/,
        /3-rd/,
        /3 rd/,
        /3–rd/,
        /[4-9]th/,
        /[4-9]-th/,
        /[4-9] th/,
        /[4-9]–th/,
    ];

    currentLine = currentLine.slice(currentLine.indexOf('@') + 1);
    currentLine = cleanLine(currentLine);

    const breakpointRegex = />{2}|[->–]/;
    let breakpoint = currentLine.search(breakpointRegex);
    if (breakpoint !== -1) {
        result += '@';
        result += currentLine.slice(0, breakpoint);
        currentLine = currentLine.slice(breakpoint);
    } else {
        let isMatch = ordinalIndicators.some((rx) => {
            return rx.exec(currentLine);
        });
        let cut;
        if (isMatch) {
            cut = currentLine.split(' ', 3).join(' ').length;
            result += '@';
            result += currentLine.split(' ', 3).join(' ');
        } else {
            cut = currentLine.split(' ', 2).join(' ').length;
            result += '@';
            result += currentLine.split(' ', 2).join(' ');
        }
        currentLine = currentLine.slice(cut);
    }

    currentLine = cleanLine(currentLine);
    return [result, currentLine];
}

function checkForTime(currentLine: string): [string, string] {
    let result = '';

    result = currentLine.slice(0, currentLine.indexOf(' '));
    currentLine = currentLine.slice(currentLine.indexOf(' '));

    currentLine = cleanLine(currentLine);
    return [result, currentLine];
}

function cleanLine(line: string): string {
    line = line.trim();
    const regex = /^>{2}|^->|^[->–,.:;>([]/;
    let fits = regex.exec(line);

    if (fits) {
        line = line.slice(fits[0].length);

        switch (fits[0]) {
            case '(':
                line = replaceAt(line, '', line.indexOf(')'));
                break;
            case '[':
                line = replaceAt(line, '', line.indexOf(']'));
                break;
        }
    }

    line = line.trim();

    return line;
}
