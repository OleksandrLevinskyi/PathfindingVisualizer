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
    [key: string]: string
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
    direction: DIRECTION
}

export enum DIRECTION {
    TOP = 'top',
    DOWN = 'down',
    RIGHT = 'right',
    LEFT = 'left'
}