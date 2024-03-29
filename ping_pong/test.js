class GameObject{

    constructor(canvas, ctx, x, y, height, width, color, xpluse, ypluse){
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.xpluse = xpluse;
        this.ypluse = ypluse;
        this.key_pressed = false;
        this.key_pressed_value = null;
        this.score = 0;
    }

    spawn() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    delete(x, y){
        this.ctx.clearRect(x, y, this.width, this.height);
    }
    
    ball_respawn(){
    	this.delete(this.x - this.xpluse, this.y - this.ypluse);
    	this.xpluse = 4;
    	this.ypluse = 1;
        this.x = canvas.width / 2;
        this.y = Math.random() * this.canvas.height;
        this.spawn();
    }
    
    speed_up(){
    	if(ball.xpluse < 0){
    		ball.xpluse = (ball.xpluse * -1) + 1/4;
    		ball.ypluse -= 1/2;
    	}
    	else{
    		ball.xpluse = (ball.xpluse * -1) - 1/4;
    		ball.ypluse -= 1/2;
    	}
    	console.log(`ball speed - ${ball.xpluse}`);
    }
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 36;
let player1 = new GameObject(canvas, ctx, 40, 20, 80, 20, 'white', 0, 0);
let player2 = new GameObject(canvas, ctx, canvas.width - 40, 20, 80, 20, 'white', 0, 0);
let ball = new GameObject(canvas, ctx, canvas.width / 2, canvas.height / 2, 20, 20, 'white', 4, 1);

function refresh_score(){
    if(player1.score == 10){
        alert('left player won!');
        player1.score = 0; player2.score = 0;
    }

    if(player2.score == 10){
        alert('right player won!');
        player1.score = 0; player2.score = 0;
    }
    document.getElementById('score').innerHTML = `${player1.score}:${player2.score}`;
}

function run_with_walls(){
    ball.delete(ball.x - ball.xpluse, ball.y - ball.ypluse);//have to fix the leaving steps
    ball.spawn();
    
    //console.log('ball moved')

    if(ball.x <= player1.x + player1.width && ball.x + ball.width >= player1.x && ball.y >= player1.y && ball.y <= player1.y + player1.height){
    	ball.speed_up();
        //ball.xpluse = -ball.xpluse;
    }
    if((ball.x >= player2.x + player2.width || ball.x + ball.width >= player2.x) && ball.y >= player2.y && ball.y <= player2.y + player2.height){
    	ball.speed_up();
        //ball.xpluse = -ball.xpluse;
    }
    if (ball.x >= canvas.width - ball.height * 2){
        player1.score++;
        ball.ball_respawn();
        refresh_score();
    }
    if(ball.x <= 0) {
        player2.score++;
        ball.ball_respawn();
        refresh_score();
    }
    if (ball.y >= canvas.height - ball.height * 2 || ball.y <= 0) {
        ball.ypluse = -ball.ypluse;
    }

    ball.y += ball.ypluse;
    ball.x += ball.xpluse;
}

function player_moved(player, ypluse){
    player.y += ypluse;
    player.spawn();
}

function action_handler(){
    if(player1.key_pressed_value == 'KeyW'){
        player1.delete(player1.x, player1.y + 5);
        player_moved(player1, -5);
    }
    if(player1.key_pressed_value == 'KeyS'){
        player1.delete(player1.x, player1.y - 5);
        player_moved(player1, 5);
    }
    if(player2.key_pressed_value == 'KeyI'){
        player2.delete(player2.x, player2.y + 5);
        player_moved(player2, -5);
    }
    if(player2.key_pressed_value == 'KeyK'){
        player2.delete(player2.x, player2.y - 5);
        player_moved(player2, 5);
    }
}

function control_key_down_handler(key_value){
    switch(key_value.code){
        case 'KeyW':{
            if(player1.key_pressed)
                return;
            //console.log(key_value.code);
            player1.key_pressed = true;
            player1.key_pressed_value = 'KeyW'
            action_handler();
            break;
        }
        case 'KeyS':{
            if(player1.key_pressed)
                return;
            //console.log(key_value.code);
            player1.key_pressed = true;
            player1.key_pressed_value = 'KeyS'
            action_handler();
            break;
        }
        case 'KeyI':{
            if(player2.key_pressed)
                return;
            //console.log(key_value.code);
            player2.key_pressed = true;
            player2.key_pressed_value = 'KeyI'
            action_handler();
            break;
        }
        case 'KeyK':{
            if(player2.key_pressed)
                return;
            //console.log(key_value.code);
            player2.key_pressed = true;
            player2.key_pressed_value = 'KeyK'
            action_handler();
            break;
        }
    }
}

function control_key_up_handler(key_value){
    if(player1.key_pressed && player1.key_pressed_value == key_value.code){
        //console.log(`key up ${key_value.code}`);
        player1.key_pressed = false;
        player1.key_pressed_value = null;
    }
    if(player2.key_pressed && player2.key_pressed_value == key_value.code){
        //console.log(`key up ${key_value.code}`);
        player2.key_pressed = false;
        player2.key_pressed_value = null;
    }
}

function main(){
    player1.spawn();
    player2.spawn();
    window.addEventListener("keydown", control_key_down_handler, false);
    window.setInterval(action_handler, 10);
    window.addEventListener("keyup", control_key_up_handler, false);
    window.setInterval(run_with_walls, 10);
}

main();
