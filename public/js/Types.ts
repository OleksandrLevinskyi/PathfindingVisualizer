export type WGAdjacencyList = {
    [key: string]: Array<AdjListItem>
}

export type AdjListItem = {
    val: string,
    weight: number
}

export type VisitedList = {
    [key: string]: boolean
}

export type DistancesList = {
    [key: string]: number
}

export type PreviousList = {
    [key: string]: string | null
}

export type ListOfGHFCosts = {
    [key: string]: GHFCosts
}

export type GHFCosts = {
    G: number,
    H: number,
    F: number
}

export type UGAdjacencyList = {
    [key: string]: Array<string>
}

export type AdjacentNode = {
    val: string,
    dir: DIRECTION
}

export enum DIRECTION {
    UP = 'up',
    DOWN = 'down',
    RIGHT = 'right',
    LEFT = 'left'
}

export type Descriptions = {
    [key: string]: string
}

export enum MODE_IMAGE{
    SUN= "https://img.icons8.com/ios-filled/50/f1c40f/sun--v1.png",
    MOON = "https://img.icons8.com/ios-glyphs/50/4a90e2/moon-symbol.png"
}