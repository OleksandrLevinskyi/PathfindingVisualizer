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

export enum MODE_IMAGE {
    SUN = "./public/images/controls/sun.png",
    MOON = "./public/images/controls/moon.png",
}

export enum INFO_ICON_IMAGE {
    LIGHT = "./public/images/controls/info-light.png",
    DARK = "./public/images/controls/info-dark.png",
}

export enum MODE {
    SUN = 'SUN',
    MOON = 'MOON',
}

export enum INFO_ICON {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}