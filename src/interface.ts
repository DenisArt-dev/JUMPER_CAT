export type Direction = 'left' | 'right';
export type VerticalDirection = 'up' | 'down';
export type PlatformType = 'standart' | 'static' | 'unsteady' | 'incline';
export type ClassNamePlayer = 'static' | 'left' | 'right' | 'jump' | 'dies';
export type DataPlayer = 'width' | 'height' | 'positionX' | 'positionY' | 'positionY2' | 'life' | 'positionOnPlatform' | 'all';
export type DataGameFild = 'width' | 'height' | 'length' | 'backgroundNow' | 'backgroundOld' | 'gameMode' | 'all'; // 'timer'
export type DataPlatform = 'width' | 'height' | 'step' | 'marginLeftMax' | 'marginLeft' | 'positionY' | 'opacity' | 'down' | 'staticDown' | 'background' | 'all';


export interface IPlayer {

    // width: number
    // height: number
    // positionX: number
    // positionY: number
    // positionY2: number
    // heightJump: number
    // life: number
    // positionOnPlatform: number
    // className: ClassNamePlayer
    // direction: Direction
    // positionDown: number

    platform: number | null
    lastPlatform: number | null
    die: boolean

    // animationSpead: {
    //     up: number
    //     down: number
    //     move: number
    // }
    
    // padding: {
    //     left: number
    //     right: number
    // }

    isMove: {
        left: boolean
        right: boolean
    }

    isJupm: {
        up: boolean
        down: boolean
    }

    resize: Function
    jump: Function
    move: Function
    checkClass: Function
    changePlatform: Function
    playerJump: Function
    playerMove: Function
    // isPlayerOnPlatform: Function
    checkMoveWithPlatform: Function
    checkOpacityCurrentPlatform: Function
    checkInclineCurrentPlatform: Function
    playerFell: Function
    getData: Function
    setPlayerDataNum: Function

}

export interface ILife {

    positionX: number
    width: number
    height: number

}

export interface IPlatform {
    
    // height: number 
    // width: number 
    // step: number 
    // spead: number 
    // type: PlatformType 
    // duration: Direction 
    // isLife: ILife | null
    // marginLeft: number 
    // marginLeftMax: number 
    // marginTop: number
    // positionY: number 
    // opacity: number 
    // down: number
    // staticDown: number
    // background: number
    // rotate: number
    
    // padding: {
    //     left: number
    //     right: number
    // }

    resize: Function
    setPositionY: Function
    checkUnsteady: Function
    checkIncline: Function
    checkStatic: Function
    getData: Function
    setData: Function

}

export interface IGameFild {

    // width: number
    // height: number
    // length: number

    // marginTop: number
    // newMarginTop: number
    // isAnimation: boolean
    platforms: IPlatform[]
    // backgroundNow: number
    // backgroundOld: number
    // screenDirection: VerticalDirection
    // animationSpead: number
    // gameMode: number
    isGameOver: boolean
    // gameStatistic: number
    // timer: number

    remove: Function
    addPlatform: Function
    setPlatformsPosY: Function
    removePlatform: Function
    moveScreen: Function
    gameOver: Function
    animation: Function
    getData: Function
    setData: Function

}

export interface PlatformsSize {

    height: number
    width: number
    down: number
    type: PlatformType

    padding: {
        left: number
        right: number
    }

}