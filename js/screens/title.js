game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10); // TODO
		// to make us go to our title screen
		me.input.bindKey(me.input.KEY.ENTER, "start");
		// this is for the text and font of the title screen to show
		me.game.world.addChild(new (me.Renderable.extend({
			init: function() {
				// call to the super class
				this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);
				// my font
				this.font = new me.Font("Chiller", 70, "white");
			},
			// to try and draw on the screen
			draw: function(renderer) {
				this.font.draw(renderer.getContext(), "Awesomenauts are Awesome!", 245, 130);
				this.font.draw(renderer.getContext(), "Press ENTER to Play!", 250, 530);
			}
		})));

		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge){
			// if we press start, 
			if(action === "start") {
				// then we will play
				me.state.change(me.state.PLAY);
			}
		});

	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// you press enter to start the game
		me.input.unbindKey(me.input.KEY.ENTER); // TODO
		me.event.unsubscribe(this.handler);
	}
});
