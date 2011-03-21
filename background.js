window.addEventListener('DOMContentLoaded', function() {
	
	var UIItemProperties = {
		disabled: false,
		title: "ByBuss",
		icon: "images/icon_18x18.png",
		popup: {
			href: "popup.html",
			width: 350,
			height: 250
		}
	};

	var button = opera.contexts.toolbar.createItem( UIItemProperties );
	opera.contexts.toolbar.addItem( button );
	
}, false);