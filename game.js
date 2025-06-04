// var newWindowInfo = null;

// window.addEventListener("resize",(e)=>{
//   newWindowInfo = {"width":document.getElementById("gameHolder").width,"height":document.getElementById("gameHolder").height};


// });

var debugVar1 = null;


async function getJSONFromURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
    
  } catch (error) {
    console.error("Could not fetch or parse the JSON:", error);
    return null;
  }
}

function getVerticalOverlap(y1, h1, y2, h2) {
  const top = Math.max(y1, y2);
  const bottom = Math.min(y1 + h1, y2 + h2);
  return Math.max(0, bottom - top); // returns 0 if there's no overlap
}


function isColiding(hb1, hb2) {
  return (
    (hb1.x < hb2.x + hb2.width &&
     hb1.x + hb1.width > hb2.x &&
     hb1.y < hb2.y + hb2.height &&
     hb1.y + hb1.height > hb2.y) /*||*/
     
//     (hb2.x <= hb1.x + hb1.width &&
//      hb2.x + hb2.width >= hb1.x &&
//      hb2.y <= hb1.y + hb1.height &&
//      hb2.y + hb2.height >= hb1.y)
  );
}

// setTimeout(() => {
//   alert(isColiding({ x: 10, y: 22, width: 50, height: 50 }, { x: 40, y: 50, width: 50, height: 50 }));
// }, 2500);


var showDebug = false;


var levelJSON;
getJSONFromURL("levelTest.json")
  .then(data => {
    if (data) {
      levelJSON = data;
  }
});

var devScreenVisible = false;
var devWindow;
var devScreenData;
window.addEventListener("keydown",(k)=>{
  if (k.key==="`"){
    if (!devScreenVisible){
      devWindow = window.open("devScreen.html","","popup");
      devScreenVisible = true;
      let intervalId = setInterval(function() {
        if (devWindow.closed) {
          clearInterval(intervalId);
          devScreenVisible = false;
  }
}, 50);
    }else{try{devWindow.focus();}catch(e){console.debug(e)}}
  }
});

function importDevScreenData (jsonOBJ){
  devScreenData = jsonOBJ;
  console.debug("recived data:\n"+devScreenData);
}

//window.addEventListener('load',function(){ //on window load

/*
!!!!!!!!
HERE GOES THE AUDIO FUNCTIONS B/C THE THING I WAS USING WAS YELLING AT ME FOR HAVING THEM IN THE MAIN.JS FILE
!!!!!!!!
*/

var audioElements = {"MenuMusic":"menuAudio"};

var prevMusicVolume = 100; //

var musicVolume = 100; //percent

let prevAudioElementId = null;

var currentLevelAudioElement = null;

function jsonContains(jsonObj, searchString) { //OMG google ai actually works for this OoO
  for (const key in jsonObj) {
    if (jsonObj[key].includes(searchString)) {
      return true;
    }
  }
  return false;
}

function jsonContainsName(jsonObj,name){ // made this myself tho
  if (jsonObj.hasOwnProperty(name)){
    return true;
  }
  else{
    return false;
  }
}

function toggleMenuMusic (/*play/pause*/p,/*BY DEFAULT (if null), TIMESTAMP = 0timeStamp*//* currently playing audio's element (if null or pause nothing happens with this)*/i){
  if (p == "play"){
    const menuAudio = document.getElementById(audioElements.MenuMusic);
    prevAudioElementId = menuAudio;
    if (!i==null){try{i.pause}catch(e){console.error(e);}}
    ///*TIME STAMP IS TOO BUGGY RN*/ if (timeStamp == null || timeStamp == 0){menuAudio.currentTime = 0; timeStamp = true;}else{if(timeStamp.isInteger){menuAudio.currentTime = timeStamp; timeStamp = true;}else{console.error(`Menu audio playing failed: \n Timestamp of menu music was invalid (The value of 'timeStamp' was ${timeStamp})`);timeStamp = false;}}
    /*if(timeStamp){*/menuAudio.play();menuAudio.loop=true;/*}*/
  }
  else{
    if (p=="pause"){
      document.getElementById(audioElements.MenuMusic).pause();
    }
    else{
      console.warn("Please input either 'play' or 'pause' for the value 'p' when using 'toggleMenuMusic'");
    }
  }
}

function loadLvlAudio(audioLink,newElement/*create new element for new audio*/,replaceElement/*Replace audio element IF newElement is false*/,newElementId,nameInJSON,replaceElementID,nameOfJSONValue/*(to replace)*/){
  if (newElement){
    if (newElementId != null || newElementId == ""){
      if (!jsonContains(audioElements,newElementId)){
        if(audioLink != "" && audioLink != null){
          if(nameInJSON != "" && nameInJSON != null){
            if(!jsonContainsName(audioElements,nameInJSON)){
              const tempAudioElement = document.createElement("audio");
              tempAudioElement.src = audioLink;
              tempAudioElement.id = newElementId;
              tempAudioElement.hidden = true;
              audioElements[nameInJSON] = newElementId;
              document.getElementById("mediaHolder").appendChild(tempAudioElement);
            }
            else{
              console.error("the ref already exists in the audio file index (loadLvlAudio)");
            }
          }
          else{
            console.error("Cannot add a audio element when the JSON id ref [its name in json / what to call it] (loadLvlAudio)");
          }
        }
        else{
          console.error("Connot add an audio element with an empty link");
        }
      }
      else{
        console.error("Cannot add an audio element with a pre-existing id (loadLvlAudio)");
      }
    }
    else{
      console.error("When creating an element, the id cannot be null or empty string (loadLvlAudio)");
    }
  }
  else{
    if (replaceElement){
      if (replaceElementID != "" && replaceElementID != null){
        document.getElementById(replaceElementID).src = audioLink;
        console.warn("REPLACE ELEMENT IS BUGGY (loadLvlAudio)");
      }
      else{
        console.error("Cannot replace nothing");
      }
    }
    else{
      console.error("newElement and replaceElement cannot both be false (loadLvlAudio function)");
    }
  }
}

function playAudio(elementID,time,loop){
  try{
    pauseAudio(prevAudioElementId);
  }
  catch(e){
    console.error(`couldn't pause audio, error:\n${e}`);
  }
  document.getElementById(elementID).play();
  document.getElementById(elementID).currentTime = time;
  document.getElementById(elementID).loop = loop;
  prevAudioElementId = elementID;
}

function pauseAudio(elementId){
  document.getElementById(elementId).pause();
}


/*
!!!!!!!!
AUDIO FUNCTIONS END HERE
!!!!!!!!
*/


//LOAD MAIN LEVEL SONGS:
function loadMainSongs(){
  loadLvlAudio("https://cdn.glitch.global/5ef2fe55-51fd-48d0-8627-9bf44bad65e7/500476_Stereo-Madness.mp3?v=1747790363115",true,false,"stereoMadnessSong","Song1");//stereo madness song
  loadLvlAudio("https://cdn.glitch.global/5ef2fe55-51fd-48d0-8627-9bf44bad65e7/522654_Back-On-Track.mp3?v=1747790418559",true,false,"backOnTrackSong","Song2");//back on track
}

//Setup laggy music vars
var menuMusicPlaying = false;
var isMainLvl = true;
var lvlId = 1;


function loadGame() {
  //canvas setup:
  const canvas = document.getElementById("gameHolder");
  const canvasContext = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  loadMainSongs();
  
  //https://stackoverflow.com/questions/24384368/simple-button-in-html5-canvas
  function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  function isInside(pos, rect) {
    return (
      pos.x > rect.x &&
      pos.x < rect.x + rect.width &&
      pos.y < rect.y + rect.height &&
      pos.y > rect.y
    );
  }

  //Classes

  class InputHandler {
    //Manages inputs
    constructor(game) {
      this.game = game;

      window.addEventListener("keydown", (keyEvent) => {
        //setup event listener for the key being pressed down

        if (
          //multi line if for better readablility <--- omfg i cant spel

          (keyEvent.key === "ArrowUp" || //to add another key do or operator "||" then (keyEvent.key === "")
            keyEvent.key === "ArrowDown" ||
            keyEvent.key === " "||
            keyEvent.key === "w"||
            keyEvent.key === "p"||
            keyEvent.key === "m"
          ) &&
          this.game.keys.indexOf(keyEvent.key) === -1
        ) {
          //-1 means if it doesn't appear in the list

          this.game.keys.push(keyEvent.key);
        }

        console.debug(`Key pressed "${keyEvent.key}"`);
      });

      window.addEventListener("keyup", (keyEvent) => {
        // setup event listener for key being let go

        //remove key from list
        if (this.game.keys.indexOf(keyEvent.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(keyEvent.key), 1); //remove 1 element from the index of the key event key
        }

        console.debug(`Key released "${keyEvent.key}"`);
      });
      /*
      
      ------------------===========CLICK EVENT=============----------------
      
      */
      const tempcanvas = document.getElementById("gameHolder");
      const game1 = this.game;
      tempcanvas.addEventListener('click',function(clickEvent){
        
        if(game1.paused){
          if(game1.showMainMenu && !game1.showLvlSelectMenu){
            var rect = {x:(tempcanvas.width/2)-100,y:tempcanvas.height/2,width:200,height:200} //rectangle info of [start] button
            if (isInside(getMousePos(tempcanvas,clickEvent),rect)){
              game1.showLvlSelectMenu = true;
              console.debug("The start button finally works");
            }
          }
          else{ //if not else then it instantly puts u in a level because of position overlapping
            
            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                      !!!!!!!!!!!!!!!!LEVEL SELECT MENU CHECKS!!!!!!!!!!!!!!!!
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            */
            
            if(game1.showMainMenu && game1.showLvlSelectMenu){
              var rect = {x:game1.width/10,y:game1.height/10,width:(game1.width/10)*8,height:(game1.height/10)*8}; //The big hitbox for the level info and stuff
              if (isInside(getMousePos(tempcanvas,clickEvent),rect)){
                if (game1.loadLevelId(game1.mainLvl)){
                  game1.showLvlSelectMenu = false;
                  game1.showMainMenu = false;
                  game1.paused = false;
                }
              }
              var rect = {x:0,y:0,width:game1.width/15,height:game1.width/15}; //the back button
              if (isInside(getMousePos(tempcanvas,clickEvent),rect)){
                game1.showLvlSelectMenu = false;
              }
              //(this.game.width-this.game.width/10,(this.game.height/2)-(this.game.height/10),this.game.width/10,this.game.width/10)
              var rect = {x:game1.width-game1.width/10,y:(game1.height/2)-(game1.height/10),width:game1.width/10,height:game1.width/10}; //the next lvl button
              if (isInside(getMousePos(tempcanvas,clickEvent),rect)){
                console.debug("pressed\n"+game1.mainLvl);
                game1.mainLvl++;
                if (game1.mainLvl>game1.numOfLvls){game1.mainLvl=game1.numOfLvls;}
              }
              
              var rect = {x:0,y:(game1.height/2)-(game1.height/10),width:game1.width/10,height:game1.width/10}; //the prev lvl button
              if (isInside(getMousePos(tempcanvas,clickEvent),rect)){
                console.debug("pressed\n"+game1.mainLvl);
                game1.mainLvl--;
                if (game1.mainLvl<1){game1.mainLvl=1;}
              }
            }
          }

        }
        
      });
      
      /*
      
      --------------------=================HOLD CLICK EVENT==============-----------------------
      
      */
      tempcanvas.addEventListener('mousedown',function(){
        console.debug("holding");
        if(!game1.keys.includes("clicking")){
          game1.keys.push("clicking");
        }
      });
      tempcanvas.addEventListener('mouseup',function(){
        console.debug("not holding");
        if (game1.keys.indexOf("clicking") > -1) {
          game1.keys.splice(game1.keys.indexOf("clicking"), 1); //remove 1 element from the index of the key event key
        }
      });
    }
  }

  class Particles {
    //Particle system
  }

  class Ground {
    //the game's ground
  }

  class Interactibles {
    // the portals, pads, that stuff
  }

  class squareStructureHitbox{
    constructor(game,y,scale){
      this.game = game;
      this.x = this.game.width;
      this.y = y;
      this.scale = scale;
      this.markedForDeletion = false;
      this.side = (this.game.width/30)*scale;
      let tempObst = new squareStructureDeathHitbox(this.game,this.y+this.side/2,1);
      this.game.levelObjects.push(tempObst);
    }
    
    isTouchingPlr(){
      return (isColiding({ x: this.x, y: this.y, width: this.side, height: this.side }, { x: this.game.player.x, y: this.game.player.y, width: this.game.player.width, height: this.game.player.height }));
    }
    
    update(){
      if (this.x<0-this.side){
        this.markedForDeletion = true;
      }
      this.x-=this.game.speedX;
      
      //FUN COLISION TEST THING:
      if(isColiding({ x: this.x, y: this.y, width: this.side, height: this.side }, { x: this.game.player.x, y: this.game.player.y, width: this.game.player.width, height: this.game.player.height })){
        this.game.player.squareColisionCheck(this);
      }
      
    }
    draw(context){
      context.fillStyle = "#0000FF77";
      context.fillRect(this.x,this.y,this.side,this.side);
    }
    
  }
  
  class deathHitbox{
    constructor(game,y,w,h){
      this.game = game;
      this.x = this.game.width;
      this.y = y;
      this.markedForDeletion = false;
      this.width = w;
      this.height=h;
    }
    
    isTouchingPlr(){
      return (isColiding({ x: this.x, y: this.y, width: this.width, height: this.height }, { x: this.game.player.x, y: this.game.player.y, width: this.game.player.width, height: this.game.player.height }));
    }
    
    update(){
      if (this.x<0-this.side){
        this.markedForDeletion = true;
      }
      this.x-=this.game.speedX;
      
      //FUN COLISION TEST THING:
      if(isColiding({ x: this.x, y: this.y, width: this.width, height: this.height }, { x: this.game.player.x, y: this.game.player.y, width: this.game.player.width, height: this.game.player.height })){
        this.game.player.deathSequence();
      }
      
    }
    draw(context){
      context.fillStyle = "#FF0000";
      context.fillRect(this.x,this.y,this.width,this.height);
    }
    
  }
  
  class squareStructureDeathHitbox{
    constructor(game,y,scale){
      this.game = game;
      this.x = this.game.width;
      this.y = y;
      this.scale = scale;
      this.markedForDeletion = false;
      this.width = (this.game.width/30)*scale;
      this.height=(this.game.height/100)*scale;
    }
    
    isTouchingPlr(){
      return (isColiding({ x: this.x, y: this.y, width: this.width, height: this.height }, { x: this.game.player.x, y: this.game.player.y, width: this.game.player.width, height: this.game.player.height }));
    }
    
    update(){
      if (this.x<0-this.side){
        this.markedForDeletion = true;
      }
      this.x-=this.game.speedX;
      
      //FUN COLISION TEST THING:
      if(isColiding({ x: this.x, y: this.y, width: this.width, height: this.height }, { x: this.game.player.x, y: this.game.player.y, width: this.game.player.width, height: this.game.player.height })){
        this.game.player.deathSequence();
      }
      
    }
    draw(context){
      context.fillStyle = "#FF0000";
      context.fillRect(this.x,this.y,this.width,this.height);
    }
    
  }
  
  class obsticalTest {
    constructor(game){
      this.game = game;
      this.x = this.game.width;
      this.y=this.game.height/2;
      this.width=20;
      this.height=20;
      this.markedForDeletion = false;
    }
    update(){
    if (this.x<0-this.width){
        this.markedForDeletion = true;
      }
      this.x-=this.game.speedX;
    }
    draw(ctx){
      ctx.fillStyle="#000000";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
 }

  
  /*
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!PLAYER CLASS!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  */
  
  class Player {
    // I wonder what this could be.... hmm
    constructor(game) {
      //Setup / init
      this.game = game; //game arg
      
      this.deathForgivenessFrame=0;
      this.canDie=false;
      
      this.structureCol = 0;
      this.structureHitboxColision=false;
      
      this.jumping=false;
      
      this.touchingGroundFix=0;
      
      this.floorEnabled = true;
      this.ceilingEnabled = true;
      
      this.canUFOClick = true; //so that you need to click twice
      
      this.width = this.game.width/30; //width
      this.height = this.game.width/30; //height

      this.reset = false;
      this.yStart = this.game.height-this.height;
      
      this.x = this.game.width/5; //x pos
      this.y = this.yStart; //y pos

      this.gameMode = "cube"; //game modes : "cube" "ship" "ball" "ufo" wave" "robot" "spider" "swing"
      this.isMini = false; // if it is mini gm
      
      //SETUP GM vars:
      this.gravity = 0.5; //used by:
      this.cubeJumpStrength = -7//used by:
      this.yvel = 0;//used by:
      this.touchingGround = false;//used by:
      this.lift = -0.8;//used by: ship
      this.gravityDir = 1;//used by: all | also 1 is down -1 is up
      this.ufoJumpForce = -10;//used by: UFO
      this.waveSpeed = 10;//used by: wave
      this.robotCharge = 0;//used by: robot gm | the charge is tick based
      this.maxRobotCharge = 15;//used by robot | this is the max tick for charging the jump
      this.robotBoostStrength = -1.3;
      this.canSpiderClick = true;
      this.canSwingClick = true;
      this.dead=false;
      
    }
    
    squareColisionCheck(squareElement){
      this.structureCol++;
      console.debug(getVerticalOverlap(this.y,this.height,squareElement.y,squareElement.side));
        if ((this.y+this.height)<(squareElement.y+squareElement.side)){
          this.y -= getVerticalOverlap(this.y,this.height,squareElement.y,squareElement.side);
          if (this.gravityDir == 1){this.touchingGroundFix++;}
        }
        else{
          this.y += getVerticalOverlap(this.y,this.height,squareElement.y,squareElement.side);
          if (this.gravityDir == -1){this.touchingGroundFix++;}
        }
      if ((this.yvel>0&&this.gravityDir==1)||(this.yvel<0&&this.gravityDir==-1)){
        this.yvel=0;
      }
/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!NEED TO FIX HITBOXES STILL CLIPPING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
      
      
            if (this.y > this.game.height-this.height || this.y == this.game.height-this.height){
              if (this.gravityDir == 1){}
              if (this.y>this.game.height-this.height){
                if (this.y>this.game.height-this.height/2){
                  console.log("died");
                  this.deathSequence();
                }
              }
      }
            if (this.y < 0 || this.y == 0){
              if (this.gravityDir == -1){}
              if (this.y<0){
                if (this.y<(this.height/-2)){
                  this.deathSequence();
                }
              }
              
              
            }
      }
      
    
    deathSequence(){
      if (!this.canDie){this.deathForgivenessFrame++;}else{
        this.dead=true;
        this.game.paused=true;
        this.game.level.pause();
        setTimeout(()=>{
          
          this.reset=true;
          this.game.paused=false;
          this.dead=false;
          this.game.frameX=0;
          this.game.levelObjects = [];
          this.game.level.reset();
        },250);//PLR DEATH TIME = 1/4 sec
      }
    }
    
    update() {
      //player tick
      
      if (this.structureCol>0){
        this.structureHitboxColision=true;
      }
      else{
        this.structureHitboxColision=false;
      }
      this.structureCol=0;
      
      if(this.reset){
        //Reset vars
        this.y = this.yStart;
        this.yvel = 0;
        this.touchingGround=false;
        this.touchingGroundFix=0;
        this.game.frameX = 0;
        this.gravityDir = 1;
        
        this.reset=false;
      }

      console.debug(
        `Current Player GM: ${this.gameMode} \n is mini: ${this.isMini}`
      );
      
      if (( //ALL PLR INPUT KEYS
        this.game.keys.includes("ArrowUp")||
        this.game.keys.includes(" ")||
        this.game.keys.includes("w")||
        this.game.keys.includes("clicking")
          )) { 
        //IF CLICKING:
        
        if (this.gameMode == "cube"){
          if (this.touchingGround){
            this.yvel += this.cubeJumpStrength*this.gravityDir;
          }
        }
        
        if (this.gameMode == "ship"){
          this.yvel += this.lift*this.gravityDir;
        }
        
        if (this.gameMode == "ball" && this.touchingGround){
          this.gravityDir = this.gravityDir*-1;
        }
        
        if (this.gameMode == "ufo"){
          if (this.canUFOClick){
            this.yvel = this.ufoJumpForce*this.gravityDir;
          }
          this.canUFOClick = false;
        }
      
      if (this.gameMode == "wave"){
          this.y-=this.waveSpeed*this.gravityDir;
        }
      
      
      if (this.gameMode == "robot"){
        if (this.touchingGround || this.robotCharge>0){
          if (this.robotCharge<this.maxRobotCharge){
              this.yvel += this.robotBoostStrength*this.gravityDir;
              this.robotCharge++;
            }
        }
      }
      
      if (this.gameMode == "spider"){
        if (this.touchingGround && this.canSpiderClick){
          this.gravityDir = this.gravityDir*-1;
          this.teleportToSurface(this.gravityDir);
          this.canSpiderClick = false;
        }
      }
      
      if (this.gameMode == "swing"){
        if(this.canSwingClick){
            this.gravityDir = this.gravityDir*-1;
            this.canSwingClick = false;
          }
        }
      }
      else{
        //IF NOT CLICKING
        
        this.canUFOClick = true;
        this.canSpiderClick = true;
        this.canSwingClick = true;
        
        
        if (this.gameMode == "ship"){
            if (!this.touchingGround){
              this.yvel -= this.lift*this.gravityDir;
            }
          }
        
        if (this.gameMode == "wave"){
          this.y+=this.waveSpeed*this.gravityDir;
        }
        
      }
      
          
          if (this.gameMode == "cube" ||this.gameMode == "ball"||this.gameMode == "ufo"||this.gameMode == "robot"||this.gameMode == "spider"||this.gameMode == "swing"){
            
            if (!this.touchingGround){
              this.yvel += this.gravity*this.gravityDir;
            }
            
          }
          
      
      //Floor:
      if (this.floorEnabled && this.gravityDir == 1){
            if (this.y > this.game.height-this.height || this.y == this.game.height-this.height){
              if (this.gravityDir == 1){this.touchingGroundFix++;}
              if (this.y>this.game.height-this.height){
                // if (this.y>this.game.height-this.height/2){
                //   console.log("died");
                //   this.deathSequence();
                // }
                this.yvel = 0;this.y = this.game.height-this.height;
              }
              
              
            }
            else{
              if(this.gravityDir ==1){
                this.touchingGroundFix+=0;
              }
            }
      }
      //Ceiling
      if (this.ceilingEnabled){
            if (this.y < 0 || this.y == 0){
              if (this.gravityDir == -1){this.touchingGroundFix++;}
              if (this.y<0){
                // if (this.y<(this.height/-2)){
                //   this.deathSequence();
                // }
                this.yvel = 0;this.y = 0;
              }
              
              
            }
            else{
              if(this.gravityDir ==-1){
                this.touchingGroundFix+=0;
              }
            }
      }
      
      if (this.touchingGround){
        this.robotCharge = 0;
      }
      
      if(this.touchingGroundFix>0){
        this.touchingGround=true;
      }
      else{this.touchingGround=false;}
      this.touchingGroundFix=0;
      
      if (this.deathForgivenessFrame>0){
        this.canDie=true;
      }
      else{
        this.canDie=false;
      }
      this.deathForgivenessFrame=0;
      
      this.y += this.yvel;
      
      
      /*
      
      !!!!WARNING!!!!
      
      THIS COULD BE A MAJOR LAG FACTOR:
      
      */
      
      //OLD FLOOR COL CODE:
      
      
//       if (this.y>this.game.height-29){
//         while(this.y>this.game.height-29){
//           this.y--;
//         }
//       }
      
//       if (this.y<0){
//         while (this.y<0){
//           this.y++;
//         }
//       }
      
      /*
      
      I NEED TO FIX THOSE WHILE LOOPS AT SOME POINT !!!!!!!!!!!!!!!!
      
      */
      
    }
    
    teleportToSurface(dir){
      
      //IM CHEATING RN AND NOT CHECKING PROPERLY UNTIL I GET THE LEVEL WORKING
      
      if (dir==1){
        /*
        
        PUT DOWNWARDS TELEPORT COL HERE
        
        */
        
        this.y = this.game.height-this.width;
        
      }
      else{
        
        /*
        
        PLACE UPWARDS TELEPORT COL HERE
        
        */
        
        this.y=0;
        
      }
      
    }
    
    draw(context) {
      // draw frame
      context.fillStyle = "#000"; //PLAYER DRAW THING HERE
      context.fillRect(this.x, this.y, this.width, this.height); //fillRect([X position],[Y position],[Width],[Height])
    }
 } 

  class Obsticles {
    //Player murderers
  }

  class Background {
    // this is a very unknown thing
  }

  class UserInterface {
    // its the ui
    constructor(game) {
      this.game = game;
    }

    update() {
      
    }

    draw(context) {
      
    }
  }
  class addButton extends UserInterface{
    constructor(game){
      
    }
  }
  class PauseScreen extends UserInterface {
    constructor(game) {
      super(game);
      this.game = game;
      this.pauseKey = "p";
      this.menuKey = "m";
      this.noDoublePause = false;
    }

    update() {
      if(!this.game.player.dead){
      if (
        this.game.keys.includes(this.pauseKey) &&
        !this.noDoublePause &&
        !this.game.showMainMenu
      ) {
        this.noDoublePause = true;
        if (game.paused) {
          this.game.paused = false;
          this.game.level.resume();
        } else {
          this.game.paused = true;
          this.game.level.pause();
        }
      }
      
      if (!this.game.keys.includes(this.pauseKey)) {
        this.noDoublePause = false;
      }
      
      if(this.game.paused && this.game.keys.includes(this.menuKey)){this.game.showMainMenu = true;this.game.showLvlSelectMenu = true;this.game.player.reset = true;}
    }
    }

    draw(context) {
      context.fillStyle = "#000";
      context.globalAlpha = 0.3;
      context.fillRect(0, 0, game.width, game.height);
      context.globalAlpha = 1.0;
      context.fillStyle = "#FFFFFF";
      context.font = "48px serif";
      context.fillText("Paused", (game.width/2)-50, game.height/3);
      context.font = "24px serif";
      context.fillText(`Press "${this.pauseKey}" to resume`, (game.width/2)-75, game.height/2);
      context.fillText(`Press "${this.menuKey}" for main menu`,game.width-250,game.height-12);
    }
  }

  class MainMenu extends UserInterface {
    constructor(game) {
      super(game);
      this.game = game;
    }

    update() {
      
    }

    draw(context) {
      if (!this.game.showLvlSelectMenu){
        context.fillStyle = "rgb(100,100,255)";
        context.fillRect(0, 0, this.game.width, this.game.height);
        context.font = "92px serif";
        context.fillStyle = "#000";
        context.strokeText("Geometry Dash JS", (canvas.width/2)-330, canvas.height/6);
        context.fillRect((canvas.width/2)-100,canvas.height/2,200,200);
      }
    }
  }
  
  class LevelSelectMenu extends UserInterface{
    constructor(game){
      super(game);
      this.game = game;
      this.rgb = {r:143,g:219,b:163};
      
    }
    
    update () {
      
    }
    
    draw (context) {
      context.fillStyle = `rgb(${this.rgb.r},${this.rgb.g},${this.rgb.b})`;
      context.fillRect(0, 0, this.game.width, this.game.height); //BG
      context.fillStyle = "#aaaaaa";
      context.fillRect(0,(this.game.height/2)-(this.game.height/10),this.game.width/10,this.game.width/10); //BUTTON ON LEFT
      context.fillRect(this.game.width-this.game.width/10,(this.game.height/2)-(this.game.height/10),this.game.width/10,this.game.width/10);//BUTTON ON RIGHT
      context.fillStyle = `rgb(${this.rgb.r/2},${this.rgb.g/2},${this.rgb.b/2})`;
      context.fillRect(this.game.width/10,this.game.height/10,(this.game.width/10)*8,(this.game.height/10)*8); //LVL HOLDER
      context.fillStyle = "#000000";
      context.fillRect(0,0,this.game.width/15,this.game.width/15);// x button
      context.fillStyle = "#ffffff";
      context.font = "92px serif";
      context.fillText(this.game.mainLvl,(this.game.width/2)-46,(this.game.height/2));
      
    }
  }
  
  
  class LevelHandler{
    constructor(game){
      this.game = game;
      this.isLoading = true;
      this.isLevelLoaded=false;
    }
    
    setupLevel (){
      this.isLoading = true;
      try{
        if(!audioElements[this.game.loadedLevel["song"]["jsonName"]]){
          loadLvlAudio(this.game.loadedLevel["song"]["url"],true,false,this.game.loadedLevel["song"]["elementId"],this.game.loadedLevel["song"]["jsonName"]);
        }
      }
      catch(e){
        console.error(`Couldn't load audio element. error:\n${e}`);
      }
      try{
        playAudio(audioElements[this.game.loadedLevel["song"]["jsonName"]],0,false);
      }
      catch(e){
        console.error(`Couldn't play audio, error:\n${e}`);
      }
      try{
        this.reset();
      }
      catch(e){
        console.error(`it was worth a shot, \n ${e}`);
      }
      this.isLoading=false;
    }
    
    pause(){
      try{
      pauseAudio(audioElements[this.game.loadedLevel["song"]["jsonName"]]);
      }
      catch(e){
        console.error(`something happened, u fix it tho not me \n ${e}`);
      }
    }
    
    resume(){
      try{
      playAudio(audioElements[this.game.loadedLevel["song"]["jsonName"]],document.getElementById(audioElements[this.game.loadedLevel["song"]["jsonName"]]).currentTime,false);
      }
      catch(e){
        console.error(`"I dont wanna\n${e}"`);
      }
    }
    
    reset(){
      playAudio(audioElements[this.game.loadedLevel["song"]["jsonName"]],0,false);
    }
    
    update(){
      // if (this.game.frameX % 15 === 0){
      //   let tempObst = new deathHitbox(this.game,/*Math.floor(Math.random()*this.game.height)*//*Math.floor(Math.random()*this.game.height)*/this.game.height-50,this.game.width/50,this.game.width/50);
      //   this.game.levelObjects.push(tempObst);
      // }
      
      if (this.game.loadedLevel&&this.game.loadedLevel["obsticles"]) {
        for (var i=0; i<this.game.loadedLevel["obsticles"].length;i++){
          console.debug(this.game.loadedLevel["obsticles"][i]);
          try{
            if (this.game.loadedLevel["obsticles"][i]["frame"]==this.game.frameX){
              let tempObst = new deathHitbox(this.game,this.game.loadedLevel["obsticles"][i]["y"],this.game.loadedLevel["obsticles"][i]["w"],this.game.loadedLevel["obsticles"][i]["h"]);
              this.game.levelObjects.push(tempObst);
            }
          }
          catch(e){
            console.error(`Error in placing object type="obsticle" \nerror:\n${e}`);
          }
        }
      }
      else{
        console.log("no loaded level");
      }
      
      if (this.game.loadedLevel&&this.game.loadedLevel["squares"]) {
        for (var i=0; i<this.game.loadedLevel["squares"].length;i++){
          console.debug(this.game.loadedLevel["squares"][i]);
          try{
            if (this.game.loadedLevel["squares"][i]["frame"]==this.game.frameX){
              let tempObst = new squareStructureHitbox(this.game,this.game.loadedLevel["squares"][i]["y"],this.game.loadedLevel["squares"][i]["scale"]);
              this.game.levelObjects.push(tempObst);
            }
          }
          catch(e){
            console.error(`Error in event \nerror:\n${e}`);
          }
        }
      }
      else{
        console.log("no loaded level");
      }
      
      if (this.game.loadedLevel&&this.game.loadedLevel["events"]) {
        for (var i=0; i<this.game.loadedLevel["events"].length;i++){
          console.debug(this.game.loadedLevel["events"][i]);
          try{
            if (this.game.loadedLevel["events"][i]["frame"]==this.game.frameX){
              if (this.game.loadedLevel["events"][i]["type"]=="gameMode"){
                this.game.player.gameMode = this.game.loadedLevel["events"][i]["value"];
              }
              else{
                if (this.game.loadedLevel["events"][i]["type"]=="speed"){
                this.game.speedX = this.game.loadedLevel["events"][i]["value"];
              }
              }
            }
          }
          catch(e){
            console.error(`Error in event \nerror:\n${e}`);
          }
        }
      }
      else{
        console.log("no loaded level");
      }
      
      
      for (var i = 0;i<this.game.levelObjects.length;i++){
        this.game.levelObjects[i].update();
        if (this.game.levelObjects[i].markedForDeletion) {
          this.game.levelObjects.splice(i, 1);
          i--;
        }
      }
    }
    draw(context){
      for (var i = 0;i<this.game.levelObjects.length;i++){
        this.game.levelObjects[i].draw(context);
      }
    }
  }

  class Game {
    // game logic
    constructor(width, height) {
      
      // newWindowInfo = null;
      
      this.loadedLevel = {};
      
      this.keys = [];
      
      this.levelObjects = [];
      
      this.frameX = 0;
      
      this.speedX = 20;
      
      this.mainLvl = 1; /*OMFG this is buggy af (this is v0.01 but damn this is such a mess already)*/
      this.numOfLvls = 22;
      
      this.paused = true;
      this.showMainMenu = true;
      this.showLvlSelectMenu = false;

      this.width = width; //get width
      this.height = height; // get height
      
      this.loadingLevel = false;

      this.player = new Player(this); //setup player with this b/c this is the game
      
      this.level = new LevelHandler(this);//Mainly logic for level
      
      this.pauseScreen = new PauseScreen(this); // UI

      this.mainMenu = new MainMenu(this); //UI
      
      this.LevelSelectMenu = new LevelSelectMenu(this); // UI

      this.inputs = new InputHandler(this); //setup input handler
      
      
      
      this.loadLevel("levelTest2.json");
      
      
    }
    
    loadLevelId(id){
      if (id==1){
        this.loadLevel("levelTest2.json");
        return true;
      }
      else{
        alert("notFinished")
        return false;
      }
    }
    
    async loadLevel(jsonURL){
      this.loadingLevel = true;
      try {
        this.loadedLevel = await getJSONFromURL(jsonURL);
        debugVar1 = this.loadedLevel;
      }
      catch(e){
        console.error(`Failed to load level, error:\n${e}`);
      }
      this.loadingLevel = false;
    }
    
    update(context) {
      
      if (!this.paused) {
        if (this.level.isLevelLoaded){
        if (!this.level.isLoading){
          this.level.update();
        
          this.player.update(); //run player update tick
          this.frameX++;
        }
        
        }
        else{
          this.level.setupLevel();
          this.level.isLevelLoaded=true;
        }
      }
      else{
        
      }
      
      
      
      this.pauseScreen.update(); //check pause
      
      if(this.player.dead){
        this.level.isLevelLoaded=false;
      }
      
      if(this.showMainMenu){
        this.level.isLevelLoaded=false;
        this.isLevelLoaded=false;
        this.levelObjects = [];
        // this.loadedLevel = {};
        if(!menuMusicPlaying){
          prevAudioElementId = audioElements.MenuMusic;
          playAudio(audioElements.MenuMusic,0,true);
          menuMusicPlaying = true;
        }
      }
      else{
        if(menuMusicPlaying){
          pauseAudio(audioElements.MenuMusic);
          menuMusicPlaying = false;
        }
      }
      
      
      
      if (devScreenVisible){
        if(devScreenData != null){
          if (devScreenData.hasOwnProperty("gameMode")){
            this.player.gameMode = devScreenData["gameMode"];
          }
          if (devScreenData.hasOwnProperty("gravity")){
            this.player.gravityDir = devScreenData["gravity"];
          }
          if (devScreenData.hasOwnProperty("showDebug")){
            showDebug = devScreenData["showDebug"];
          }
          devScreenData = null;
        }
      }
      
      
      
      
    }

    draw(context) {
      this.player.draw(context); //have plr draw its self
      this.level.draw(context);
      if (this.paused) {
        if (this.showMainMenu) {
          this.mainMenu.draw(context);
          if (this.showLvlSelectMenu){
            this.LevelSelectMenu.draw(context);
          }
          
        } else {
          if (!this.player.dead){
            this.pauseScreen.draw(context);
          }
          else{
            if (showDebug){
              context.fillStyle="#FF0000";
              context.font = "48px serif";
              context.fillText("DEAD",this.width/2,this.height/2);
            }
          }
        }
      }
      else{
        
      }
      
      if (showDebug){
        context.font = "24px serif";
        context.fillStyle="#FF0000";
        context.fillText("keys: "+this.keys,0,24*1);
        context.fillText("levelObjects: "+this.levelObjects,0,24*2);
        context.fillText("frameX: "+this.frameX,0,24*3);
        context.fillText("speedX: "+this.speedX,0,24*4);
        context.fillText("mainLvlId: "+this.mainLvl+"/"+this.numOfLvls,0,24*5);
        context.fillText("paused: "+this.paused,0,24*6);
        context.fillText("showMainMenu: "+this.showMainMenu,0,24*7);
        context.fillText("showLvlSelectMenu: "+this.showLvlSelectMenu,0,24*8);
        context.fillText("width: "+this.width,0,24*9);
        context.fillText("height: "+this.height,0,24*10);
        context.fillText("floorEnabled: "+this.player.floorEnabled,0,24*11);
        context.fillText("ceilingEnabled: "+this.player.ceilingEnabled,0,24*12);
        context.fillText("canUFOClick: "+this.player.canUFOClick,0,24*13);
        context.fillText("Reset?: "+this.player.reset,0,24*14);
        context.fillText("yStart: "+this.player.yStart,0,24*15);
        context.fillText("player width: "+this.player.width,0,24*16);
        context.fillText("player height: "+this.player.height,0,24*17);
        context.fillText("player x: "+this.player.x,0,24*18);
        context.fillText("player y: "+this.player.y,0,24*19);
        context.fillText("gameMode: "+this.player.gameMode,0,24*20);
        context.fillText("isMini: "+this.player.isMini,0,24*21);
        context.fillText("gravity: "+this.player.gravity,0,24*22);
        context.fillText("cubeJumpStrength: "+this.player.cubeJumpStrength,0,24*23);
        context.fillText("yvel: "+this.player.yvel,0,24*24);
        context.fillText("touchingGround: "+this.player.touchingGround,0,24*25);
        context.fillText("lift: "+this.player.lift,0,24*26);
        context.fillText("gravityDir: "+this.player.gravityDir,0,24*27);
        context.fillText("ufoJumpForce: "+this.player.ufoJumpForce,0,24*28);
        context.fillText("waveSpeed: "+this.player.waveSpeed,0,24*29);
        context.fillText("robotCharge: "+this.player.robotCharge+"/"+this.player.maxRobotCharge,0,24*30);
        context.fillText("robotBoostStrength: "+this.player.robotBoostStrength,0,24*31);
        context.fillText("canSpiderClick: "+this.player.canSpiderClick,0,24*32);
        context.fillText("canSwingClick: "+this.player.canSwingClick,0,24*33);
        context.fillText("loadedLevel: "+this.player.loadedLevel,0,24*34);
        
      }
      if (prevMusicVolume != musicVolume){prevMusicVolume = musicVolume; document.getElementById(currentLevelAudioElement).volume = musicVolume/100;}
      
      // if (newWindowInfo != null){
      //   alert(newWindowInfo.width+" "+newWindowInfo.height);
      //   this.width = newWindowInfo.width;
      //   this.height = newWindowInfo.height;
      //   newWindowInfo = null;
      // }
      
    }
  }

  //Start game:
  const game = new Game(canvas.width, canvas.height);

  //animation / draw loop:
  function animationLoop() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height); //clear canvas / fill canvas all the way
    game.update();
    game.draw(canvasContext);
    requestAnimationFrame(animationLoop);
  }

  animationLoop();
}

