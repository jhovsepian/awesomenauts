game.ExperienceManager = Object.extend({
	init: function(x, y, settings) {
		this.alwaysUpdate = true;
		this.gameover = false;
	},

	update: function() {
		// wont work till flags are set
		if(game.data.win === true && !this.gameover) {
			this.gameOver(true);
			// wont be called until flags are set
		}else if(game.data.win === false && !this.gameover) {
			// if i lose gains only 1 
			this.gameOver(false);
		}

		return true;
	},

	gameOver: function(win) {
		if(win) {
			//adds sceen by 10 if i win
			game.data.exp += 10;
		}else {
			game.data.exp += 1;
		}

		this.gameover = true;
		me.save.exp = game.data.exp;
		
	}
});
