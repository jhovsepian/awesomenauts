game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
		// what to look at besides maps
		//to load level 1
		me.levelDirector.loadLevel("level01");
		
		this.resetPlayer(0, 420);	

		var gamemanager = me.pool.pull("GameManager", 0, 0, {});
		me.game.world.addChild(gamemanager, 0);

		// binds the key for movement
		// moves player to the right
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		// makes player move left
		me.input.bindKey(me.input.KEY.LEFT, "left");
		//make player jump
		me.input.bindKey(me.input.KEY.SPACE, "jump");
		// makes player attack
		me.input.bindKey(me.input.KEY.A, "attack");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	}, 


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},

	resetPlayer: function(x, y) {
			// to make our player show
		game.data.player = me.pool.pull("player", x, y, {});
		// this brings him to the world
		me.game.world.addChild(game.data.player, 5);
	}


});
