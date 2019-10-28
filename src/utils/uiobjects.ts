import filter from "lodash.filter";
import includes from "lodash.includes";
import { QuestionMetadata } from "../models/quest";

export function isQuestionWithTextInput(question: QuestionMetadata): boolean {
    return (question.kind === 'number' || question.kind === 'text');
}

export function addOrRemove<T>(array: T[], value: T): T[] {
    if (includes(array, value)) {
        return filter(array, item => item !== value);
    } else {
        return [...array, value];
    }
}
