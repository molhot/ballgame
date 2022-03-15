var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/*ctx.~pathの中にキャンバスに記述するコマンドを書く
ctx.beginPath();

ctx.rect(40,40,50,50);
ctx.fillStyle = "black";
ctx.fill();

ctx.closePath();
*/

var x = 200;
var y = 200;
var dx = 1;
var dy = -1;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var bricks = [];

for(var c=0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++){
        bricks[c][r] = { x:0, y:0, status:1};
    }
}

function drawBricks(){
    for(var c=0; c<brickColumnCount; c++){
        for(var r=0; r<brickRowCount; r++){
            if(bricks[c][r].status == 1){
                var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;        
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawball(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection(){
    for(var c=0; c<brickColumnCount; c++){
        for(var r= 0;r<brickRowCount; r++){
            var b = bricks[c][r];
            //衝突しているかどうかの確認
            //ボールが設置した物体の中に入った瞬間を検知
            //x座標、y座標が内部に存在するという4つの条件
            if(x>b.x&&x<b.x+brickWidth&&y>b.y&&y<b.y+brickHeight){
                dy = -dy;
                b.status = 0;
                score = score + 100;
                if(score == brickRowCount * brickColumnCount){
                    alert("you win");
                    document.location.reload();
                }
            }
        }
    }
}

function drawscore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score,8,20);
}

document.addEventListener("keydown",keyDownHandler,false);
function keyDownHandler(e){
    //https://developer.mozilla.org/ja/docs/Web/API/KeyboardEvent/key
    //上にキーイベントについて簡単にアプリ化されているものがある
    //keydownつまり入力が起こっている際はこのイベントを行う
    //rightの入力はIEなどの場合に必要になる
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}

document.addEventListener("keyup",keyUpHandler,false);
function keyUpHandler(e){
    if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
    else if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBricks();
    drawball();
    drawPaddle();
    drawscore();

    collisionDetection();

    x = x + dx;
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx;
    }
    y = y + dy;
    if(y + dy < ballRadius){
        dy = -dy;
    }
    else if(y + dy > canvas.height - ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -1.1 * dy;
            dx = 1.1 * dx;
        }
        else{
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX = paddleX + 5;
    }
    else if(leftPressed && paddleX > 0){
        paddleX = paddleX - 5;
    }
}

var interval = setInterval(draw, 20);
