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
		// this is the standing animation
		this.renderable.addAnimation("idle", [78]);
		//this is to add the walking animation.
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
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
			// to flip the character the right way
			this.flipX(true);
		}else{
			// if youre not pressing the right key then the player wont move
			this.body.vel.x = 0;
		}
		// only to go to walk animation when walking
		if(this.body.vel.x !== 0) { 
		if(!this.renderable.isCurrentAnimation("walk")) {
			this.renderable.setCurrentAnimation("walk");
		}
	}else{
		this.renderable.setCurrentAnimation("idle");
	}


		// delta is change in time
		this.body.update(delta);
		// this is to update our animation
		this._super(me.Entity, "update", [delta]);
		return true;
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
				return (new me.Rect(0, 0, 100, 100)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);


		this.type = "EnemyBaseEntity";



	},

	update:function(delta) {
		if(this.health<=0) {
			this.broken = true;
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function() {

	}

});