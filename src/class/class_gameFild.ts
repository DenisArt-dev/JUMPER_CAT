import gsap from 'gsap';

import Platform from './class_platform';
import { IPlayer, VerticalDirection, DataGameFild } from '../interface';

export default class GameFild {

    public static staticWith: number = 1080;
    // public static staticHeight: number = 1920;
    public static staticHeight: number = window.innerHeight;

    private width: number = GameFild.staticWith;
    private height: number = GameFild.staticHeight;
    private length: number = 0;
    private backgroundMain: boolean = false;
    private backgroundPosition: number = 0;
    private backgroundNow: number = 1;
    private backgroundOld: number = 0;
    private animationSpead: number = 5;
    private gameMode: number = -1;
    // private timer: number = new Date().setHours(0, 0, 30);
    private gameStatistic: number = 0;
    private marginTop: number = 0;
    private newMarginTop: number = 0;
    private screenDirection: VerticalDirection = 'up';
    private isAnimation: boolean = false;
    // private timeInterval: any = null;
    // private backgroundIntrval: any = null;

    public isGameOver: boolean = false;
    public platforms = [new Platform(0, 0, 0, 333)];

    constructor(mode: number) {

        if (mode === -1) return;

        // this.timeInterval = setInterval( () => {
        //     this.timer -= 1000;
        // }, 1000 );

        this.gameMode = mode;

        this.platforms.push(new Platform(this.gameMode, 0, 0, 350, 'static'));
        this.platforms.shift();

        this.length += this.platforms[0].getData('height') + Platform.staticMarginTop;

        for (let i = 0; i < Infinity; i++) {
            this.platforms.push(new Platform(this.gameMode, i + 1));
            this.length += this.platforms[i + 1].getData('height') + Platform.staticMarginTop;
            if (this.length + 200 > this.height) break;
        }

        this.setPlatformsPosY();

        this.backgroundMain = true;
        // if (this.gameMode === 1) this.backgroundMain = true;

        if (!this.backgroundMain) setTimeout( () => { this.changeBackground() }, 6000);
        window.addEventListener('resize', () => {
            this.height = window.innerHeight;
        });

    }

    public remove(): void {
        this.platforms = [];
    }

    public addPlatform(newPlatform: any): void {
        this.platforms.push(newPlatform);
        this.length += this.platforms[this.platforms.length - 1].getData('height') + Platform.staticMarginTop;
        this.setPlatformsPosY();
    }

    public setPlatformsPosY() {

        for (let i = 0; i < this.platforms.length; i++) {
            this.platforms[i].setPositionY(this.platforms);
        }

    }

    public removePlatform() {
        this.length -= this.platforms[this.platforms.length - 1].getData('height') + Platform.staticMarginTop;
        this.platforms.pop();
    }

    public moveScreen(direction: VerticalDirection, player: IPlayer) {

        if (player.platform === null) return;

        if (direction === 'up') {

            this.screenDirection = 'up';
            this.addPlatform(new Platform(this.gameMode, this.platforms[this.platforms.length - 1].getData('step') + 1));
            this.newMarginTop = this.marginTop;
            this.marginTop += -(Platform.staticMarginTop + this.platforms[this.platforms.length - 1].getData('height'));
            this.isAnimation = true;

        } else if (direction === 'down') {

            if (player.lastPlatform === null || player !== null && player.lastPlatform <= player.platform || player.platform === 0) return;

            this.screenDirection = 'down';
            this.newMarginTop = -(Platform.staticMarginTop + this.platforms[this.platforms.length - 1].getData('height'));
            this.isAnimation = true;

        }

    }

    public gameOver(player: IPlayer, all: boolean) {

        let delay = 3000;

        player.setPlayerDataNum('life', player.getData('life') - 1);
        player.die = true;
        player.isJupm.up = false;
        player.isJupm.down = false;
        player.isMove.right = false;
        player.isMove.left = false;
        player.platform = null;

        if (all) {
            player.setPlayerDataNum('life', 0);
            delay = 1;
        }

        setTimeout(() => {

            if (player.getData('life') >= 1) {

                if (player.lastPlatform !== null) {

                    if (this.platforms[player.lastPlatform].getData('opacity') <= 0) {
                        player.lastPlatform++;
                    }

                    let posOnPlatf = (this.platforms[player.lastPlatform].getData('width') / 2) - (player.getData('width') / 2);
                    player.setPlayerDataNum('positionX', this.platforms[player.lastPlatform].getData('marginLeft')
                    + posOnPlatf);

                    player.die = false;

                    player.changePlatform(player.lastPlatform, this.platforms, posOnPlatf);

                }

            } else {
                gsap.killTweensOf( document.getElementById('background_Old') ); 
                this.isGameOver = true;
            }

        }, delay);

    }

    public animation() {

        if (!this.isAnimation) return;

        if (this.screenDirection === 'up') {
      
            this.marginTop += this.animationSpead;

            if (this.backgroundMain) {

                this.backgroundPosition -= (this.animationSpead / 2);

                let element = document.getElementById('backgroundMain');

                if (element && this.backgroundPosition < -(element.offsetHeight - this.height)) {
                    this.backgroundPosition = -(element.offsetHeight - this.height);
                }
            }
    
            if ( this.marginTop >= this.newMarginTop ) {
              this.marginTop = this.newMarginTop;
              this.isAnimation = false;
            }
    
        } else if (this.screenDirection === 'down') {
    
            this.marginTop -= this.animationSpead;

            if (this.backgroundMain) this.backgroundPosition += (this.animationSpead / 2);
            if (this.backgroundPosition > 0) this.backgroundPosition = 0;
    
            if ( this.marginTop <= this.newMarginTop ) {
              this.removePlatform();
              this.marginTop = 0;
    
              this.isAnimation = false;
            }
    
        }

    }

    public getData(data: DataGameFild): any {

        if (data === 'all') {

            let cloleThis: any = {};

            for (let key in this) {
                cloleThis[key] = this[key];
            }

            return cloleThis;

        } else return this[data];

    }

    public setData(data: DataGameFild, value: number): void {

        if (data !== 'all') this[data] = value;

    }


    // static

    public static getRandomMinMax(min: number, max: number, afterPoint?: number): any {
        if (!afterPoint) afterPoint = 0;
        return +(min + Math.random() * (max - min)).toFixed(afterPoint);
    }


    // private

    private changeBackground() {

        gsap.to( '#background_Old', {
            opacity: 0,
            duration: 3,
            onComplete: () => {

                if (this.backgroundOld + 1 < 3) this.backgroundOld++;
                else this.backgroundOld = 0;

                gsap.to( '#background_Old', {
                    opacity: 1,
                    duration: 3,
                    onComplete: () => {
    
                        if (this.backgroundNow + 1 < 3) this.backgroundNow++;
                        else this.backgroundNow = 0;
    
                        setTimeout( () => { this.changeBackground() }, 6000);
                    }
                } );

            }
        } );

    }

}