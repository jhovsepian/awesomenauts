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

		var gameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
		 me.game.world.addChild(gameTimerManager, 0);

		 var heroDeathManager = me.pool.pull("HeroDeathManager", 0, 0, {});
		 me.game.world.addChild(heroDeathManager, 0);

		 var experienceManager = me.pool.pull("ExperienceManager", 0, 0, {});
		 me.game.world.addChild(experienceManager, 0);

		 var spendGold = me.pool.pull("spendGold", 0, 0, {});
		 me.game.world.addChild(spendGold, 0);

		 game.data.minimap = me.pool.pull("minimap", 10, 10, {});
		 me.game.world.addChild(game.data.minimap, 30);

		 me.input.bindKey(me.input.KEY.B, "buy");
		 me.input.bindKey(me.input.KEY.Q, "skill1");
		 me.input.bindKey(me.input.KEY.W, "skill2");
		 me.input.bindKey(me.input.KEY.E, "skill3");
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
		console.log("reset " + game.data.player.health);
			// to make our player show
		game.data.player = me.pool.pull("player", x, y, {});

		console.log("pulled " + game.data.player.health);
		// this brings him to the world
		me.game.world.addChild(game.data.player, 5);
		game.data.miniPlayer = me.pool.pull("miniplayer", 10, 10, {});
		me.game.world.addChild(game.data.miniPlayer, 31);
	}


});
