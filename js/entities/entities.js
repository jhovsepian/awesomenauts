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
		this.body.setVelocity(5, 0);

	},

	update: function(delta) {
		// to see if right key is pressed
		if(me.input.isKeyPressed("right")){
			// adds to the postion of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}else{
			// if youre not pressing the right key then the player wont move
			this.body.vel.x = 0;
		}
		// delta is change in time
		this.body.update(delta);
		return true;
	}
});