game.ExperienceManager = Object.extend({
	init: function(x, y, settings) {
		this.alwaysUpdate = true;
		this.gameover = false;
	},

	update: function() {
		// wont work till flags are set
		if(game.data.win === true && !this.gameover) {
			this.gameOver(true);
			alert("YOU WIN!");
			// wont be called until flags are set
		}else if(game.data.win === false && !this.gameover) {
			// if i lose gains only 1 
			this.gameOver(false);
			alert("YOU LOSE!");
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


			$ajax({
				type: "POST",
				url: "php/controller/save-user.php",
				data:  {
					exp: game.data.exp, 
					exp1: game.data.exp1, 
					exp2: game.data.exp2, 
					exp3: game.data.exp3, 
					exp4: game.data.exp4, 
				},

				dataType: "text"
			})
				.success(function(response) {
					if(response==="true") {
						me.state.change(me.state.MENU);
					}else{
						alert(response);
					}
				})
					.fail(function(response) {
						alert("Fail");
			 });
	}
});
