game.MiniMap = me.Entity.extend({
	init: function(x, y, settings) {
		this._super(me.Entity, "init", [x, y, {
			image: "minimap", 
			width: 279,
			height: 155,
			spritewidth: "279",
			spriteheight: "155",
			getShape: function() {
				return (new me.Rect(0, 0, 279, 155)).toPolygon();
			}
		}]);
		this.floating = true;
	}
});