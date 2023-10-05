import GameFild from './class_gameFild';

export default class Life {

    public positionX: number = 0;
    public width: number = 30;
    public height: number = 30;

    constructor (platformWidth: number) {
        this.positionX = GameFild.getRandomMinMax(0, platformWidth - 30); 
    }

}