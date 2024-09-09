import React, { useEffect, useState } from 'react';
import CompPlatform from './components/comp_platform';
import CompPlayer from './components/comp_player';

import AppStyle from './App.module.css';

import Player from './class/class_player';
import GameFild from './class/class_gameFild';

import { IPlayer, IGameFild } from './interface';

import backgroundImg from './img/background.jpg';
import previewImg1 from './img/preview_1.jpg';
import previewImg2 from './img/preview_2.jpg';

const imgBox: any = setImgBox();
const timerDefault = [0, 0, 0];
const modeText = ['Easily', 'Difficult'];

let isRun = false;

const formatterDate = new Intl.DateTimeFormat('ru', {
  minute: '2-digit',
  second: '2-digit'
});

let mode: number = -1;
let player: IPlayer | null = null;
let gameFild: IGameFild | null = null;
let timerInterval: any = null;
let isLoading: boolean = true;

function setImgBox(): any {

  let imgBox: any = [];

  for (let i = 0; i < 2; i++) {

    let mode: any = [];

    import(`./img/${i}/background.jpg`).then((result) => {
      mode.push(result.default);
    });

    imgBox.push(mode);

  }

  return imgBox;

}


function start(selectMode: number, setMode: any) {

  // setMode(-2);

  go(selectMode, setMode);

  // setTimeout(() => { go(selectMode, setMode) }, 10000);

}

function end(setModeF: any, setTimerF: any, setSelectModeF: any) {

  gameFild?.remove();

  isRun = false;
  mode = -1;
  player = null;
  gameFild = null;
  isLoading = true;

  setModeF(mode);
  setTimerF(0);
  setSelectModeF(0);

  document.onkeyup = null;
  document.onkeydown = null;

  clearInterval(timerInterval);
  timerInterval = null;

}

function go(selectMode: number, setMode: any) {

  setMode(selectMode);

  mode = selectMode;
  player = new Player(mode);
  gameFild = new GameFild(mode);

  // player.getData('all');

  player.changePlatform(0, gameFild.platforms);

  document.onkeydown = (event: KeyboardEvent) => {

    if (player === null || gameFild === null) return;

    if (event.key === 'ArrowUp') player.jump();
    if (event.key === 'ArrowRight') player.move('right');
    if (event.key === 'ArrowLeft') player.move('left');

  }

  document.onkeyup = (event: KeyboardEvent) => {

    if (player === null || gameFild === null) return;

    if (event.key === 'ArrowRight') player.isMove.right = false;
    if (event.key === 'ArrowLeft') player.isMove.left = false;

  }

  setTimeout( () => {
    isLoading = false;
  }, 10000 );

}


function buttonsHandl(event: any): void {

  if (player === null) return;

  event.preventDefault();

  let target = event.target;

  if (event.target.nodeName === 'P') target = target.parentElement;

  let sw = false;

  if (event.type === 'pointerup') sw = true;

  if (target.dataset.type === 'up') {
    player.jump();
  } else if (target.dataset.type === 'right') {
    if (sw) player.isMove.right = false;
    else player.move('right');
  } else if (target.dataset.type === 'left') {
    if (sw) player.isMove.left = false;
    else player.move('left');
  }

}

function App() {

  const [mode, setMode] = useState(-1);
  const [selectMode, setSelectMode] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect( () => {

    document.body.style.height = window.innerHeight + 'px';

    window.onresize = () => {
      document.body.style.height = window.innerHeight + 'px';
    }

    return () => {
      window.onresize = null;
    }

  }, [] );

  if (mode > -1 && !isRun) {

    setTimer( new Date().setHours(timerDefault[0], timerDefault[1], timerDefault[2]) );

    if (!timerInterval) {
      timerInterval = setInterval(() => {
        setTimer((old) => { return !isLoading ? old + 10 : old });
      }, 10);
    }

    isRun = true;
  }

  if (player !== null) player.checkClass();

  if (player !== null && gameFild !== null && player.platform !== null) {

    gameFild.animation();

    player.checkMoveWithPlatform(gameFild);
    player.checkOpacityCurrentPlatform(gameFild);
    player.checkInclineCurrentPlatform(gameFild);

    if (player.isJupm.up || player.isJupm.down) {
      player.playerJump(gameFild);
    }

    if (player.platform !== null && player.isMove.left || player.isMove.right) {
      player.playerMove(gameFild);
    }

  } else if (player !== null && gameFild !== null && player.getData('positionY') > gameFild.getData('length') - gameFild.getData('height')) {
    player.playerFell();
  }

  if (gameFild?.getData('isGameOver')) end(setMode, setTimer, setSelectMode);

  return (

    <div className={AppStyle['container']} style={{
      backgroundImage: `url(${backgroundImg})`
    }}>

      {mode === -1 &&
        <div className={AppStyle['startWindow']}>

          <h1>JUMPER CAT</h1>

          <p className={AppStyle['startWindow__f11']}>Press <span>F11</span> for a more complete dive</p>

          <div className={AppStyle['startWindow__wrappMode']}>
            <div onClick={(event) => { event.preventDefault(); setSelectMode(0) }}
                 data-id={0}
                 className={[
                  selectMode === 0 ?
                  `${AppStyle['startWindow__mode-select']} ${AppStyle['startWindow__mode']}` :
                  AppStyle['startWindow__mode']
                 ].join(' ')
                }
                style={{
                  backgroundImage: `url(${previewImg1})`
                 }}
            ><p>{modeText[0]}</p></div>
            <div onClick={(event) => { event.preventDefault(); setSelectMode(1) }}
                 data-id={1} className={[
                  selectMode === 1 ?
                  `${AppStyle['startWindow__mode-select']} ${AppStyle['startWindow__mode']}` :
                  AppStyle['startWindow__mode']
                 ].join(' ')}
                 style={{
                  backgroundImage: `url(${previewImg2})`
                 }}
            ><p>{modeText[1]}</p></div>
            {/* <div onClick={() => { setSelectMode(2) }} data-id={2} className={[selectMode === 2 ? `${AppStyle['startWindow__mode-select']} ${AppStyle['startWindow__mode']}` : AppStyle['startWindow__mode']].join(' ')}></div> */}
          </div>

          <div><button onClick={() => { start(selectMode, setMode) }} className={AppStyle['startWindow__buttonStart']}>Start</button></div>

        </div>}
      {mode > -1 && <div className={AppStyle['gameWrapp']}>

        { isLoading && 
          <div className={AppStyle['beforeGame']}>
            <div>
              <p className={AppStyle['beforeGame_text']}>LOADING...</p>
              <div className={AppStyle['beforeGame_bar']}>
                <div className={AppStyle['beforeGame_runner']}></div>
              </div>
            </div>
          </div>
        }

        {gameFild && <div className={[gameFild.isGameOver ? AppStyle['gameOver'] : AppStyle['game']].join(' ')}
          style={{
            width: gameFild.getData('width'),
            height: gameFild.getData('height'),
          }}>

          {gameFild.getData('backgroundMain') && 
            <div id="backgroundMain"
                 style={ { backgroundImage: `url(${imgBox[mode][0]})`, bottom: gameFild.getData('backgroundPosition') + 'px' } } 
                 className={AppStyle['backgroundMain']}></div>
          }

          {player && <div className={AppStyle['gameContent']} style={{ marginTop: gameFild.getData('marginTop') + 'px' }}>

            {!gameFild.isGameOver && < CompPlayer player={player} />}

            {gameFild.platforms.map((item) => {
              if (player !== null && gameFild !== null)
                return <CompPlatform gameFild={gameFild} player={player} platformParams={item} key={item.getData('step')} />
            })}
          </div>}

          {!gameFild.getData('isGameOver') && 
            <div className={AppStyle['gameHeader']}>

              <div className={AppStyle['gameHeader_content']}>

                <div className={AppStyle['gameHeader_content-info']}>
                  {player !== null && 
                    <div className={AppStyle['playerLife']}>
                      {new Array(player.getData('life')).fill(null).map((item, i) => {
                      return <svg key={i} version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"> <path d="M23 2c-2.404 0-4.331 0.863-6.030 2.563-0.001 0.001-0.002 0.002-0.003 0.003h-0.001l-0.966 1.217-0.966-1.143c-0.001-0.001-0.002-0.002-0.003-0.003h-0.001c-1.7-1.701-3.626-2.637-6.030-2.637s-4.664 0.936-6.364 2.636c-1.699 1.7-2.636 3.96-2.636 6.364 0 2.402 0.935 4.662 2.633 6.361l11.947 12.047c0.375 0.379 0.887 0.592 1.42 0.592s1.045-0.213 1.42-0.592l11.946-12.047c1.698-1.699 2.634-3.958 2.634-6.361s-0.937-4.664-2.636-6.364c-1.7-1.7-3.96-2.636-6.364-2.636v0z"></path></svg>
                    })}
                    </div>
                  }
                  <p>TIME: {formatterDate.format(new Date(timer))}</p>
                  <p>POINTS: {gameFild.getData('gameStatistic')}</p>
                </div>

                <button onClick={() => { if (gameFild !== null)
                        gameFild.gameOver(player, true) }}
                        className={AppStyle['gameHeader_button']}
                >Exit</button>

              </div>

            </div>
          }

        </div>}

      </div>}
    </div>

  );

}

export default App;
