game.PlayerEntity = me.Entity.extend ({
	// constructer function to set us up
	init: function(x, y, settings) {
		this.setSuper(x, y);
		this.setPlayerTimers();
		this.setAttributes();
		this.type = "PlayerEntity";
		this.setFlags();

		// no matter where the player goes it will will follow him
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
		this.addAnimation();
		
		// to set the walking animation. 
		this.renderable.setCurrentAnimation("idle");
	},

	setSuper: function(x, y) {
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
	},

	setPlayerTimers: function() {
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastSpear = this.now;
		this.lastAttack = new Date().getTime();
	},

	setAttributes: function() {
		// chooses velocity for our player
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		this.attack = game.data.playerAttack;	
	},

	setFlags: function() {
		// keeps track of which direction your character is going
		this.facing = "right";
		this.dead = false;  
		this.attacking = false;
	},

	addAnimation: function() {
		// this is the standing animation
		this.renderable.addAnimation("idle", [78]);
		//this is to add the walking animation.
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
	},

	update: function(delta) {
		this.now = new Date().getTime();
		this.dead = this.checkIfDead();
		this.checkKeyPressesAndMove();
		this.checkAbilityKeys();
		this.setAnimation();
		// to collide with the base
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		// delta is change in time
		this.body.update(delta);
		// this is to update our animation
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	checkIfDead: function() {
		if(this.health <= 0) {
			return true;
		}
		return false;
	},

	checkKeyPressesAndMove: function() {
		// to see if right key is pressed
		if(me.input.isKeyPressed("right")){
			this.moveRight();
			// to see if left key is pressed
		}else if(me.input.isKeyPressed("left")){
		this.moveLeft();
		}else{
			// if youre not pressing the right key then the player wont move
			this.body.vel.x = 0;
		}
		// makes the player jump and fall back down
		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
			this.jump();
		}

		this.attacking = me.input.isKeyPressed("attack");
	},

	moveRight: function() {
			// adds to the postion of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			//to face right
			this.facing = "right";
			// to flip the character the right way
			this.flipX(true);
	},

	moveLeft: function() {
			this.facing = "left";
			// same things goes for the comments for right
			this.body.vel.x -=this.body.accel.x * me.timer.tick;
			// to not flip the character
			this.flipX(false);
	},

	jump: function() {
		this.jumping = true;
	this.body.vel.y -= this.body.accel.y * me.timer.tick;
	},

	checkAbilityKeys: function() {
		if(me.input.isKeyPressed("skill1")) {
			// this.speedBurst();
		}else if(me.input.isKeyPressed("skill2")) {
			// this.eatCreep();
		}else if(me.input.isKeyPressed("skill3")) {
			this.throwSpear();
		}
	},

	throwSpear: function() {
		if((this.now-this.lastSpear) >= game.data.spearTimer*1000 && game.data.ability3 > 0) { 
			this.lastSpear = this.now;
			var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
			me.game.world.addChild(spear, 10);
		}
	},

	setAnimation: function() {
			// hold down attack button
		if(this.attacking){
			if(!this.renderable.isCurrentAnimation("attack")) {
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
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
	},

	// info about the handler
	collideHandler: function(response) {
		console.log(response.b.type);
		// to see whatever were colliding with
		if(response.b.type==='EnemyBaseEntity') {
			console.log("EnemyBase");
			this.collideWithEnemyBase(response);

		}else if(response.b.type==='EnemyCreep') {
			this.collideWithEnemyCreep(response);
		}

	},

	collideWithEnemyBase: function(response) {
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
	},
	collideWithEnemyCreep: function(response) {
		var xdif = this.pos.x - response.b.pos.x;
			var ydif = this.posy - response.b.pos.y;

			this.stopMovement(xdif);
			
			if(this.checkAttack(xdif, ydif)) {
				this.hitCreep(response);
			};
	},

	stopMovement: function(xdif) {
		if(xdif>0) {
				//this.pos.x = this.pos.x + 1;
				if(this.facing==="left") {
					this.body.vel.x = 0;
				}
			}else {
				//this.pos.x = this.pos.x - 1;
				if(this.facing==="right") {
					this.body.vel.x = 0;
				}
			}
	},

	checkAttack: function(xdif, ydif) {
		if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
				&& (Math.abs(ydif) <=40) && 
				(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
				) {
				this.lastHit = this.now;
				return true;
			}
			return false;
		},

				
				hitCreep: function(response) {
									//if the creeps health is less than our attack, execute code in if statement
				if(response.b.health <= game.data.playerAttack) {
					//adds one gold for a creep kill
					game.data.gold += 1;
					// keeps track of gold
					console.log("Current gold: " + game.data.gold);
				}

				response.b.loseHealth(game.data.playerAttack);
				}
});





