
export type Quest = {
    id: number;
    name: string;
    position: string; //format: latitude,longitude
    steps: QuestStep[];
}

export type QuestStep = {
    id: number;
    beacon: number;
    instructions: string;
    name: string;
    properties: string;
    quest: number;
    quest_index: number;
    type: 'info' | 'question' | 'media';
    value_points: number;
}

export type QuestFinder = {
    beacon: {
        id: number;
        name: string;
        beacon_id: string;
    };
    quests: Quest[];
}

export type Question = {
    q: string;
    r: string;
    kind: 'text' | 'number' | 'multiple';
    answerExplanation: string;
}