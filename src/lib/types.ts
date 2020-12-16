export interface World {
    id: string;
    name: string;
    description: string;
}

export interface Campaign {
    id: string;
    name: string;
    sentence: string;
    nemesisNPC: NPC;
}

export interface NPC {
    id: string;
    name: string;
    description: string;
    nemesisForCampaign: string | undefined;
}

export interface Act {
    id: string;
    title: string;
    summary: string;
    ordinal: number;
}

export interface Chapter {
    id: string;
    title: string;
    summary: string;
    ordinal: number;
    actId: string;
}

export interface Section {
    id: string;
    title: string;
    content: string;
    ordinal: number;
    chapterId: string;
    mapUrl: string;
}