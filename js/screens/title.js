game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10); // TODO
		// this is for the text and font of the title screen to show
		me.game.world.addChild(new (me.Renderable.extend({
			init: function() {
				// call to the super class
				this._super(me.Renderable, 'init', [270, 240, 300, 50]);
				// my font
				this.font = new me.Font("Chiller", 70, "white");
				me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
			},
			// to try and draw on the screen
			draw: function(renderer) {
				this.font.draw(renderer.getContext(), "Awesomenauts is Awesome!", this.pos.x, this.pos.y);
			},

			update: function(dt) {
				return true;
			},

			newGame: function() {
				me.input.releasePointerEvent('pointerdown', this);
				me.state.change(me.state.NEW);
			}
		})));

		// this is for the text and font of the title screen to show
		me.game.world.addChild(new (me.Renderable.extend({
			init: function() {
				// call to the super class
				this._super(me.Renderable, 'init', [380, 340, 250, 50]);
				// my font
				this.font = new me.Font("Chiller", 70, "white");
				me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
			},
			// to try and draw on the screen
			draw: function(renderer) {
				this.font.draw(renderer.getContext(), "Play Now to Continue", this.pos.x, this.pos.y);
			},

			update: function(dt) {
				return true;
			},

			newGame: function() {				
				me.input.releasePointerEvent('pointerdown', this);
				me.state.change(me.state.LOAD);
			}
		})));

	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	
	}
});
