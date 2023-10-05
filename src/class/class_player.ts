import { Direction, IPlatform, ClassNamePlayer, IGameFild, DataPlayer } from '../interface';
import GameFild from './class_gameFild';
import Platform from './class_platform';

export default class Player {

    private type = [
        {  
            animationSpead: { up: 3, down: 7, move: 2 },
            padding: { left: 45/2, right: 45/2, bottom: 50/2, top: 33/2 },
            width: 100,
            height: 100,
            heightJump: 280,
            background: 0
        }
    ]

    private width: number = 0;
    private height: number = 0;
    // private playerWidth: number = 0;
    // private playerHeight: number = 0;
    private positionX: number = 0;
    private positionY: number = 0;
    private positionY2: number = 0;
    private heightJump: number = 0;
    private life: number = 2;
    private positionOnPlatform: number = 0;
    private className: ClassNamePlayer = 'static';
    private direction: Direction = 'left';
    private positionDown: number = this.positionY;
    private background: number = 0;

    // private margin: any = {
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0,
    // }

    private animationSpead = {
        up: 0,
        down: 0,
        move: 0,
    };

    private padding = {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    };

    public die: boolean = false;
    public platform: number | null = 0;
    public lastPlatform: number | null = null;

    public isMove = {
        left: false,
        right: false
    };

    public isJupm = {
        up: false,
        down: false,
    };


    constructor(mode: number) {

        // let type = mode === 1 ? 1 : 0;
        let type = 0;

        this.background = this.type[type].background;
        this.width = this.type[type].width;
        this.height = this.type[type].height;
        this.padding = this.type[type].padding;
        this.animationSpead = this.type[type].animationSpead;
        this.heightJump = this.type[type].heightJump;

        this.positionX = (GameFild.staticWith - this.width) / 2;

    }


    public resize() {
        // this.positionX = (GameFild.staticWith - this.width) / 2;
    }

    public jump() {

        if (this.isJupm.up || this.isJupm.down) return;

        this.isJupm.up = true;
        this.positionDown = this.positionY;

    }

    public move(direction: Direction) {

        if (direction === 'right') this.isMove.right = true;
        if (direction === 'left') this.isMove.left = true;

    }

    public checkClass(): any {

        if (this.die) {

            this.className = 'dies';

        } else if (this.isJupm.up && !this.isJupm.down) {

            this.className = 'jump';

        } else if (!this.isJupm.down && this.isMove.left || !this.isJupm.down && this.isMove.right) {

            this.className = this.isMove.left ? 'left' : 'right';

        } else this.className = 'static';

    }

    public changePlatform(newPlatform: number, allPlatforms: IPlatform[], positionOnPlatform?: number) {

        if (newPlatform === null) return;

        this.lastPlatform = this.platform;
        this.platform = newPlatform;

        if (positionOnPlatform !== undefined) this.positionOnPlatform = positionOnPlatform;
        else this.positionOnPlatform = this.positionX - allPlatforms[this.platform].getData('marginLeft');

        this.isJupm.down = false;
        this.isJupm.up = false;

        this.standsOnPlatform(allPlatforms);

    }

    public playerJump(gameFild: IGameFild) {

        if (this.platform === null) return;

        if (gameFild.platforms[this.platform].getData('type') !== 'static') {

            if (gameFild.platforms[this.platform].getData('duration') === 'left') this.positionOnPlatform += gameFild.platforms[this.platform].getData('spead');
            else this.positionOnPlatform -= gameFild.platforms[this.platform].getData('spead');

        }

        if (this.isJupm.up) {

            this.positionY += this.animationSpead.up;

            if (this.positionY + gameFild.getData('marginTop') > gameFild.getData('marginTop') + this.positionDown + this.heightJump) {
                this.positionY = gameFild.getData('marginTop') + this.positionDown + this.heightJump;
                this.isJupm.up = false;
                this.isJupm.down = true;
            }

        }

        if (this.isJupm.down) {

            this.positionY -= this.animationSpead.down;
            gameFild.platforms[this.platform].setData('down', gameFild.platforms[this.platform].getData('staticDown'));

            let plplNew: null | number = null;

            for (let i = this.platform + 1; i >= 0; i--) {
                if (this.isPlayerOnPlatform(i, true, gameFild)) {
                    plplNew = i;
                    break;
                }
            }

            if (plplNew !== null) {

                this.changePlatform(plplNew, gameFild.platforms);

                let playerYfromUp = gameFild.getData('length') - this.positionY;
                let partScreen = gameFild.getData('height') / 1.5;

                gameFild.setData('gameStatistic', this.platform);

                if (playerYfromUp < partScreen) gameFild.moveScreen('up', this);
                else if (playerYfromUp > partScreen * 1.1) gameFild.moveScreen('down', this);

            } else {

                if (gameFild.getData('height') > gameFild.getData('length')) {

                    if (this.positionY < 0 && Math.abs(this.positionY) > gameFild.getData('height') - gameFild.getData('length')) {
                        gameFild.gameOver(this);
                    }

                } else if (this.positionY < gameFild.getData('length') - gameFild.getData('height')) {
                    gameFild.gameOver(this);
                }

            }

        }

    }

    public playerMove(gameFild: IGameFild) {

        if (gameFild.getData('gameMode') === 1) {
            if (this.isJupm.up || this.isJupm.down) return;
        }


        if (this.isMove.left) {

            if (this.direction !== 'left') this.direction = 'left';

            this.positionX -= this.animationSpead.move;
            this.positionOnPlatform -= this.animationSpead.move;

            if (this.positionX < 0) {
                this.positionX = 0;
                this.positionOnPlatform = 0;
            }

        }

        if (this.isMove.right) {

            if (this.direction !== 'right') this.direction = 'right';

            this.positionX += this.animationSpead.move;
            this.positionOnPlatform += this.animationSpead.move;

            if (this.positionX > gameFild.getData('width') - this.width) {
                this.positionX = gameFild.getData('width') - this.width;
                this.positionOnPlatform = gameFild.getData('width') - this.width;
            }

        }

    }

    public checkMoveWithPlatform(gameFild: IGameFild) {

        if (this.platform === null) return;
        else if (gameFild.platforms[this.platform].getData('type') === 'static' || this.isJupm.up || this.isJupm.down) return;

        let newPos = gameFild.platforms[this.platform].getData('marginLeft') + this.positionOnPlatform;

        if (newPos < 0 - this.padding.left) this.positionX = 0 - this.padding.left;
        else if (newPos + this.width - this.padding.right > gameFild.getData('width')) 
            this.positionX = gameFild.getData('width') - this.width + this.padding.right;
        else this.positionX = newPos;

        this.changePlatform(this.platform, gameFild.platforms);

    }

    public checkOpacityCurrentPlatform(gameFild: IGameFild) {

        if (this.platform === null) return;

        if (gameFild.platforms[this.platform].getData('opacity') <= 0) {

            this.isJupm.down = true;

        } else if (!this.isJupm.up && !this.isJupm.down) {

            if (!this.isPlayerOnPlatform(this.platform, false, gameFild)) {

                this.isJupm.down = true;
                this.lastPlatform = this.platform;

            }

        }

    }

    public checkInclineCurrentPlatform(gameFild: IGameFild) {

        if (this.platform === null) return;

        if (gameFild.platforms[this.platform].getData('type') === 'incline' && !this.isJupm.down && !this.isJupm.up) {

            if (this.positionY2 !== 0) this.positionY2 = this.positionY;

            let offset = gameFild.platforms[this.platform].getData('rotate') * 0.1;

            this.positionX += offset;

            let r = 0;
            let partPlatform = gameFild.platforms[this.platform].getData('width') / 2;

            if (this.positionOnPlatform - partPlatform > 0) {

                r = this.positionOnPlatform - partPlatform + this.width / 2;

                gameFild.platforms[this.platform].setData('down', gameFild.platforms[this.platform].getData('staticDown') + 2 * Math.PI * r * (gameFild.platforms[this.platform].getData('rotate') / 360));

            } else {
                r = partPlatform - this.positionOnPlatform - this.width / 2;
                gameFild.platforms[this.platform].setData('down', gameFild.platforms[this.platform].getData('staticDown') - 2 * Math.PI * r * (gameFild.platforms[this.platform].getData('rotate') / 360));
            }

            this.changePlatform(this.platform, gameFild.platforms);

            if (!this.isPlayerOnPlatform(this.platform, false, gameFild)) {
                this.lastPlatform = this.platform;
                this.isJupm.down = true;
            }

        }

    }

    public playerFell() {  
        this.positionY -= this.animationSpead.down;
    }

    public getData(data: DataPlayer) : any {

        if (data === 'all') {

            let cloleThis: any = {};

            for (let key in this) {
                cloleThis[key] = this[key];
            }

            return cloleThis;

        } else return this[data];

    }

    public setPlayerDataNum( data: DataPlayer, value: number ) : void {

       if (data !== 'all') this[data] = value;

    }

    // private

    private isPlayerOnPlatform(currentPlatform: number, isJupm: boolean, gameFild: IGameFild): any {

        if (this.platform === null) return;

        let result = false;

        let rightSidePlatform =
            gameFild.platforms[currentPlatform].getData('marginLeft') +
            gameFild.platforms[currentPlatform].getData('width') -
            gameFild.platforms[currentPlatform].getData('all').padding.right;

        let leftSidePlatform =
            gameFild.platforms[currentPlatform].getData('marginLeft') +
            gameFild.platforms[currentPlatform].getData('all').padding.left;

        if (this.positionX + this.width - this.padding.right > leftSidePlatform &&
            this.positionX + this.padding.left < rightSidePlatform) result = true;

        if (!isJupm) return result;

        else if (
            this.positionY < gameFild.platforms[currentPlatform].getData('positionY') + this.animationSpead.down &&
            this.positionY > gameFild.platforms[currentPlatform].getData('positionY') - this.animationSpead.down && result === true
        ) return true;
        else return false;

    }

    private standsOnPlatform(allPlatforms: IPlatform[]) {

        if (this.platform === null) return;

        let y = 0;

        for (let i = allPlatforms[0].getData('step'); i <= this.platform; i++) {

            if (i < this.platform) y += allPlatforms[i].getData('height') + Platform.staticMarginTop;

            if (allPlatforms[i].getData('step') === this.platform) {
                y += allPlatforms[this.platform].getData('height') - allPlatforms[this.platform].getData('down');
            }

        }

        this.positionY = y;
    }

}