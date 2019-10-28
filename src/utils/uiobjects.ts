import { QuestionMetadata } from "../models/quest";

export function isQuestionWithTextInput(question: QuestionMetadata): boolean {
    return (question.kind === 'number' || question.kind === 'text');
}