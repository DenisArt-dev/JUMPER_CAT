import { IPlatform, IPlayer, IGameFild } from '../interface';
import PlatformStyle from './platform.module.css';

const maxImg = 14;
const imgBox = setImgBox();

function setImgBox(): any {

    let imgBox: any = [];
      
    for (let i = 0; i < maxImg; i++) {

        import(`../img/platforms/${i}.png`).then( ( result ) => {
            imgBox.push(result.default);
        } );
  
    }

    return imgBox;

}

interface Params {
    platformParams: IPlatform
    player: IPlayer
    gameFild: IGameFild
}

export default function CompPlatform(params: Params) {

    params.platformParams.checkUnsteady(params.player);
    params.platformParams.checkIncline(params.player);
    params.platformParams.checkStatic(params.player);

    return (
  
        <div className={PlatformStyle['platform']}
            style={{
                width: params.platformParams.getData('width') + 'px',
                marginLeft: params.platformParams.getData('marginLeft') + 'px',
                height: params.platformParams.getData('height'),
                marginTop: params.platformParams.getData('marginTop') + 'px',
                opacity: params.platformParams.getData('opacity'),
                transform: `rotate(${params.platformParams.getData('rotate')}deg)`,
                backgroundImage: `url(${imgBox[params.platformParams.getData('background')]})`
            }}>
        </div>
        
    );
  
};