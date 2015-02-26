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
		this.health = game.data.playerBaseHealth;
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