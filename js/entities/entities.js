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
		this.type = "PlayerEntity";
		// chooses velocity for our player
		this.health = 20;
		this.body.setVelocity(5, 20);
		// keeps track of which direction your character is going
		this.facing = "right";
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime();
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
		this.now = new Date().getTime();
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
		// hold down attack button
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

		// no attack animation going on
		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) { 
		if(!this.renderable.isCurrentAnimation("walk")) {
			this.renderable.setCurrentAnimation("walk");
		}
		// if not attacking nothing will work
	}else if(!this.renderable.isCurrentAnimation("attack")) {
		this.renderable.setCurrentAnimation("idle");
	}

	
		// to collide with the base
		me.collision.check(this, true, this.collideHandler.bind(this), true);

		// delta is change in time
		this.body.update(delta);
		// this is to update our animation
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
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
			// to collide to the top of the base
			// y var to come first
			// not to walk on the base first
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
			// if attacking
			// see if its 400 mili seconds since last hit
			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000) {
				// then we lose health
				console.log("Tower Hit");
				this.lastHit = this.now;
				response.b.loseHealth();
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
		this.type = "PlayerBase";
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

	loseHealth: function(damage) {
		this.health = this.health - damage;
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

	},
	loseHealth: function() {
		// to make the health go down one
		this.health--;
	}

});

game.EnemyCreep = me.Entity.extend ({
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "creep1",
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function() {
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);
		// 10 health
		this.health = 10;
		// to always move on screen
		this.alwaysUpdate = true;
		//lets us know if the enemy is currently attacking
		this.attacking = false;
		//keeps track of when our creep is last attacking anything
		this.lastAttacking = new Date().getTime();
		// keeps track of the last time we hit anything
		this.lastHit = new Date().getTime();
		this.now = new Date().getTime();
		// velocity to start
		this.body.setVelocity(3, 20);
		// enemey creep 
		this.type = "EnemyCreep";

		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");
	},
	// represents time
	update: function(delta) {
		this.now = new Date().getTime();

		this.body.vel.x -= this.body.accel.x * me.timer.tick;

		me.collision.check(this, true, this.collideHandler.bind(this), true);

		// update the creep
		this.body.update(delta);


		// this is to update our animation
		this._super(me.Entity, "update", [delta]);

		return true;

	},

	collideHandler: function(response) {
		if(response.b.type==='PlayerBase') {
			this.attacking=true;
			this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to maintain its position
			this.pos.x = this.pos.x + 1;
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000)) {
				//updates the lasthit timer
				this.lastHit = this.now;
				//makes the player base call its losehealth function and passes it a
				//damage of 1
				response.b.loseHealth(1);
			}
		}else if(response.b.type==='PlayerEntity') {
			var xdif = this.pos.x - response.b.pos.x;

			this.attacking=true;
			//this.lastAttacking=this.now;
			
			
			if(xdif>0) {
				console.log(xdif);	
				//keeps moving the creep to the right to maintain its position		
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
		}	
			//checks that it has been at least 1 second since this creep hit something
			if((this.now-this.lastHit >= 1000) && xdif>0) {
				//updates the lasthit timer
				this.lastHit = this.now;
				//makes the player base call its losehealth function and passes it a
				//damage of 1
				response.b.loseHealth(1);
			}
		}
	}

});

game.GameManager = Object.extend({
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();

		this.alwaysUpdate = true;
	},

	update: function() {
		this.now = new Date().getTime();

		if(Math.round(this.now/1000) % 10 ===0 && (this.now - this.lastCreep >= 1000)) {
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}

		return true;
	}
});