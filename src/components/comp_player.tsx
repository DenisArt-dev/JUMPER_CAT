import { IPlayer } from "../interface";
import PlayerStyle from './player.module.css';

interface Arg {
    player: IPlayer
}

const maxPlayers = 1;
const imgKinds: any = ['static', 'jump', 'dies', 'left', 'right'];
const imgBox = setImgBox();

function setImgBox(): any {

    let imgBox: any = [];

    for (let i = 0; i < maxPlayers; i++) {

        let mode: any = {};
      
        for (let ii = 0; ii < imgKinds.length; ii++) {
      
          import(`../img/players/player_${i}_${imgKinds[ii]}.png`).then( ( result ) => {
            mode[imgKinds[ii]] = result.default;
          } );
      
        }
      
        imgBox.push(mode);
      
      }

    return imgBox;

}

function CompPlayer(arg: Arg) {

    return (
        <div className={ PlayerStyle['player'] }
            style={{
                left: arg.player.getData('positionX') + 'px',
                bottom: arg.player.getData('positionY') - arg.player.getData('padding').bottom + 'px',
                height: arg.player.getData('height'),
                width: arg.player.getData('width'),
                backgroundImage: `url(${imgBox[arg.player.getData('background')][arg.player.getData('className')]})`,
            }} >
        </div>
    )

}

export default CompPlayer;