import { PlatformType, Direction, ILife, PlatformsSize, IPlatform, IPlayer, DataPlatform } from '../interface';
import GameFild from './class_gameFild';

export default class Platform {

    // public static staticHeight: number = 50;
    public static staticMarginTop: number = 50;
    // public static staticMinWidht: number = 100;
    // public static staticMaxWidht: number = 500;

    // public static platformsSize: PlatformsSize[][] = [
    //     [
    //         { height: 200, width: 300, down: 80, type: 'standart', padding: { left: 45, right: 35 } },
    //         { height: 108, width: 300, down: 45, type: 'unsteady', padding: { left: 45, right: 30 } },
    //         { height: 100, width: 325, down: 50, type: 'incline', padding: { left: 35, right: 10 } },
    //         { height: 125, width: 335, down: 50, type: 'standart', padding: { left: 40, right: 70 } },
    //     ],
    //     [
    //         { height: 135 / 2.5, width: 385 / 2.5, down: 45, type: 'standart', padding: { left: 15, right: 15 } },
    //         { height: 110, width: 500, down: 40, type: 'incline', padding: { left: 20, right: 30 } },
    //     ],
    //     [
    //         { height: 90, width: 380, down: 15, type: 'standart', padding: { left: 5, right: 15 } },
    //         { height: 140, width: 400, down: 25, type: 'unsteady', padding: { left: 15, right: 15 } },
    //         { height: 115, width: 345, down: 45, type: 'incline', padding: { left: 25, right: 40 } },
    //         { height: 164, width: 351, down: 100, type: 'incline', padding: { left: 25, right: 40 } },
    //     ]
    // ];
    public static platformsSize: PlatformsSize[] = [
        { height: 180, width: 262, down: 48, type: 'standart', padding: { left: 18, right: 30 } },
        { height: 171, width: 292, down: 28, type: 'standart', padding: { left: 5, right: 40 } },
        { height: 141, width: 211, down: 20, type: 'standart', padding: { left: 0, right: 0 } },
        { height: 199, width: 280, down: 70, type: 'standart', padding: { left: 10, right: 10 } },
        { height: 153, width: 257, down: 48, type: 'standart', padding: { left: 0, right: 0 } },
        { height: 117, width: 178, down: 0, type: 'incline', padding: { left: 0, right: 0 } },
        { height: 92, width: 286, down: 0, type: 'incline', padding: { left: 5, right: 5 } },
        { height: 106, width: 238, down: 53, type: 'incline', padding: { left: 40, right: 40 } },
        { height: 105, width: 249, down: 63, type: 'incline', padding: { left: 25, right: 25 } },
        { height: 106, width: 244, down: 53, type: 'incline', padding: { left: 35, right: 35 } },
        { height: 84, width: 255, down: 50, type: 'unsteady', padding: { left: 15, right: 15 } },
        { height: 78, width: 217, down: 33, type: 'unsteady', padding: { left: 25, right: 15 } },
        { height: 114, width: 216, down: 50, type: 'unsteady', padding: { left: 13, right: 5 } },
        { height: 112, width: 310, down: 43, type: 'unsteady', padding: { left: 26, right: 11 } },
    ];

    private height: number = 0;
    private width: number = 0;
    private step: number = 0;
    private spead: number = GameFild.getRandomMinMax(0.3, 2.5, 2);
    private marginLeftMax: number = 0;
    private marginLeft: number = 0;
    private positionY: number = 0;
    private opacity: number = 1;
    private down: number = 0;
    private staticDown: number = 0;
    private background: number = 0;
    private rotate: number = 0;
    private speedRotate: number = 0.0005;
    private speedDisappear: number = 0.002;
    private type: PlatformType = 'standart';
    private duration: Direction = (GameFild.getRandomMinMax(1, 2) === 2) ? 'left' : 'right';
    private marginTop: number = Platform.staticMarginTop;
    private padding = { left: 0, right: 0 };
    
    // private isLife: ILife | null = null;

    constructor(mode: number, step: number, platform?: number, marginLeft?: number, type?: PlatformType) {

        this.background = GameFild.getRandomMinMax(0, Platform.platformsSize.length - 1);
        if (platform !== undefined) this.background = platform;

        this.height = Platform.platformsSize[this.background].height;
        this.width = Platform.platformsSize[this.background].width;
        this.down = Platform.platformsSize[this.background].down;
        this.padding = Platform.platformsSize[this.background].padding;

        // if (Platform.platformsSize[mode][this.background].type === 'standart') {
        //     this.type = (GameFild.getRandomMinMax(1, 100) > 5) ? 'standart' : 'static';
        // } else this.type = Platform.platformsSize[mode][this.background].type;

        this.type = Platform.platformsSize[this.background].type;

        this.staticDown = this.down;

        if (type !== undefined) this.type = type;

        this.step = step;
        this.marginLeftMax = GameFild.staticWith - this.width;

        if (marginLeft !== undefined) this.marginLeft = marginLeft;
        else this.marginLeft = GameFild.getRandomMinMax(0, this.marginLeftMax);

    }

    public resize() {
        // this.marginLeftMax = GameFild.staticWith - this.width;
        // if (this.width + 50 >= GameFild.staticWith) this.width = Platform.staticMinWidht;
        // if (this.type === 'static') {
        //     this.marginLeft = (GameFild.staticWith - this.width) / 2;
        // }
    }

    public setPositionY(allPlatforms: IPlatform[]): void {

        let y: number = this.height - this.down;

        for (let i = this.step - 1; i >= 0; i--) {

            y += allPlatforms[i].getData('height') + Platform.staticMarginTop;

        }

        this.positionY = y;

    }

    public checkUnsteady(player: IPlayer) {

        if (this.type === 'unsteady' && player.platform === this.step && !player.isJupm.down && !player.isJupm.up) {
            if (this.opacity > 0) this.opacity -= this.speedDisappear;
        } else {
            if (this.opacity < 1) this.opacity += this.speedDisappear;
        }

    }

    public checkIncline(player: IPlayer) {

        if (this.type === 'incline') {

            let plWdth = this.width / 2;

            if (player.platform === this.step && !player.isJupm.down && !player.isJupm.up) {

                if (player.getData('positionOnPlatform') + player.getData('width') / 2 > plWdth && Math.abs(this.rotate) < 50) {

                    let posPl = player.getData('positionOnPlatform') - plWdth + player.getData('width') / 2 - this.padding.right;

                    this.rotate += this.speedRotate * posPl;

                } else if (Math.abs(this.rotate) < 50) {

                    let posPl = plWdth - player.getData('positionOnPlatform') - player.getData('width') / 2 + this.padding.left;

                    this.rotate -= this.speedRotate * posPl;
                }

            } else {

                if (this.rotate > -0.5 && this.rotate < 0.5) this.rotate = 0;
                if (this.rotate < 0 && this.rotate < 0) this.rotate += 0.5;
                else if (this.rotate > 0 && this.rotate > 0) this.rotate -= 0.5;
                
            }

        }

    }

    public checkStatic() {

        if (this.marginLeftMax === 0) {
            this.marginLeftMax = GameFild.staticWith - this.width;
        }

        if (this.type !== 'static') {

            if (this.duration === 'right') {
                this.marginLeft = this.marginLeft + this.spead;
                if (this.marginLeft > this.marginLeftMax) {
                    this.marginLeft = this.marginLeftMax;
                    this.duration = 'left';
                }
            } else {
                this.marginLeft = this.marginLeft - this.spead;
                if (this.marginLeft < 0) {
                    this.marginLeft = 0;
                    this.duration = 'right';
                }
            }

        }

    }

    public getData(data: DataPlatform) {

        if (data === 'all') {

            let cloleThis: any = {};

            for (let key in this) {
                cloleThis[key] = this[key];
            }

            return cloleThis;

        } else return this[data];

    }

    public setData(data: DataPlatform, value: number) {

        if (data !== 'all') this[data] = value;

    }

}