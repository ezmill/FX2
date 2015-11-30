function Mask(){
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.radius = 0.0;
	this.color = "white";
	this.counter = 0;
	this.mouse;
	this.init = function(){
		this.canvas.width = renderSize.x;
		this.canvas.height = renderSize.y;
		this.erase();
		// document.body.appendChild(this.canvas);
	}
	this.update = function(){
		if(mouseDown){
			this.radius = 100.0;
			this.drawCircle();
		}
	}
	this.drawCircle = function(){
		this.ctx.beginPath();
		this.ctx.arc(this.mouse.x - this.radius/2, this.mouse.y - this.radius/2, this.radius, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = this.color;
		this.ctx.shadowColor = this.color;
		this.ctx.shadowBlur = this.radius/2;
		this.ctx.fill();   
	}
	this.switchColor = function(){
		if(this.counter%2 == 0){
			this.color = "black";
		} else {
			this.color = "white";
		}
		this.counter++;
	}
	this.erase = function(){
		this.ctx.beginPath();
		this.ctx.rect(0,0, renderSize.x, renderSize.y);
		this.ctx.fillStyle = 'black';
		this.ctx.fill();	
	}
}