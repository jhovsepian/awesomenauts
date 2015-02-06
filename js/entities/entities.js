game.PlayerEntity = me.Entity.extend ({
	// constructer function to set us up
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "player",
			// what amount of space to preserve
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function () {
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);
		// chooses velocity for our player
		this.body.setVelocity(5, 20);
		// keeps track of which direction your character is going
		this.facing = "right";
		// no matter where the player goes it will will follow him
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		// this is the standing animation
		this.renderable.addAnimation("idle", [78]);
		//this is to add the walking animation.
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
		// to set the walking animation. 
		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta) {
		// to see if right key is pressed
		if(me.input.isKeyPressed("right")){
			// adds to the postion of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			//to face right
			this.facing = "right";
			// to flip the character the right way
			this.flipX(true);
			// to see if left key is pressed
		}else if(me.input.isKeyPressed("left")){
			this.facing = "left";
			// same things goes for the comments for right
			this.body.vel.x -=this.body.accel.x * me.timer.tick;
			// to not flip the character
			this.flipX(false);
		}else{
			// if youre not pressing the right key then the player wont move
			this.body.vel.x = 0;
		}
		// makes the player jump and fall back down
		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
			this.jumping = true;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}

		if(me.input.isKeyPressed("attack")){
			if(!this.renderable.isCurrentAnimation("attack")) {
				console.log(!this.renderable.isCurrentAnimation("attack"));
				//sets the current animation to attack and once that is over
				// goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//makes it so that the next time we start this sequence
				//from the first animation, not wherever we left off or when we
				//switched to the other animation
				this.renderable.setAnimationFrame();
			}
		}



		// only to go to walk animation when walking
		else if(this.body.vel.x !== 0) { 
		if(!this.renderable.isCurrentAnimation("walk")) {
			this.renderable.setCurrentAnimation("walk");
		}
	}else{
		this.renderable.setCurrentAnimation("idle");
	}

	if(me.input.isKeyPressed("attack")){
			if(!this.renderable.isCurrentAnimation("attack")) {
				console.log(!this.renderable.isCurrentAnimation("attack"));
				//sets the current animation to attack and once that is over
				// goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//makes it so that the next time we start this sequence
				//from the first animation, not wherever we left off or when we
				//switched to the other animation
				this.renderable.setAnimationFrame();
			}
		}
		// to collide with the base
		me.collision.check(this, true, this.collideHandler.bind(this), true);

		// delta is change in time
		this.body.update(delta);
		// this is to update our animation
		this._super(me.Entity, "update", [delta]);
		return true;
	},
	// info about the handler
	collideHandler: function(response) {
		// to see whatever were colliding with
		if(response.b.type==='EnemyBaseEntity') {
			//to see what we are dealing with
			// the difference between the player and the y position
			var ydif = this.pos.y - response.b.pos.y;
			// same for x as above
			// to keep track of both objects
			var xdif = this.pos.x - response.b.pos.x;

			// to know the x difference and y differnce, on where to go
			console.log("xdif " + xdif + " ydif " + ydif);
			
			if(ydif<-40 && xdif< 70 && xdif>-35) {
				this.body.falling = false;
				this.body.vel.y = -1;
			}

			// if i gone far from 35 it will stop the character from moving
			else if(xdif>-35 && this.facing==='right' && (xdif<0)) {
				// stop my player from moving
				this.body.vel.x = 0;
				// move the player backwards
				this.pos.x = this.pos.x -1;
				// keeping me from walking to the left and the right
			}else if(xdif<70 && this.facing==='left'&& (xdif>0)) {
				this.body.vel.x = 0;
				this.pos.x = this.pos.x +1;

			}
		}

	}
});

game.PlayerBaseEntity = me.Entity.extend({
	init : function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function() {
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		// the tower has not been destroyed
		this.broken = false;
		// 10 health
		this.health = 10;
		//this updates the game
		this.alwaysUpdate = true;
		// if someone runs into the tower it will collide with it
		this.body.onCollision = this.onCollision.bind(this);

		// type that i can see what im running into things
		this.type = "PlayerBaseEntity";
		// 0 is the not buring animation
		this.renderable.addAnimation("idle", [0]);
		// breaks our animations
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta) {
		// if my health is less than or equal to 0,
		if(this.health<=0) {
			//then we are dead
			this.broken = true;
			this.renderable.setCurrentAnimation("broken")
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function() {
		
	}

});

game.EnemyBaseEntity = me.Entity.extend({
	init : function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function() {
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);


		this.type = "EnemyBaseEntity";
		// not a buring tower
		this.renderable.addAnimation("idle", [0]);
		// buring animation will break
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");

	},

	update:function(delta) {
		if(this.health<=0) {
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;

	},

	onCollision: function() {

	}

});