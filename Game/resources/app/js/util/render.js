var render={};//The render method, to apply transition effects to elements 


render.fade={//The fade functions, to fade elements in and out.
	fadeTime:300,
	in: function(element) {
		element.classList.remove("r_invis");
		return (delay(this.fadeTime, system.screen.timers.localTimerIds));
	},
	out: function(element) {
		element.classList.add("r_invis");
		return (delay(this.fadeTime, system.screen.timers.localTimerIds));
	}
};


render.footer={//The footer functions to hide, show and make the footer transparent.
	hide: function() {
		document.getElementById("footer").classList.remove("r_halfvisible");
		document.getElementById("footer").classList.add("r_invis");
	},
	show: function() {
		document.getElementById("footer").classList.remove("r_halfvisible");
		document.getElementById("footer").classList.remove("r_invis");
	},
	transparentize: function() {
		document.getElementById("footer").classList.remove("r_invis");
		document.getElementById("footer").classList.add("r_halfvisible");
	},
};


render.forceRedraw=function(element) {//The force redraw function to set an element back to its original state.
  element.offsetHeight;
};

render.insertUID=function(string,UID) {//The insert UID function to change placeholder UIDs to the correct ones in a string.
	return string.split("UID").join(UID);
};

//Animation control functions to add and remove animations from an element.
render.setAnimation=function (id, className) {
	this.forceRedraw(id);
	document.querySelector("#"+String(id)).classList.add(className);
	this.forceRedraw(id);
}
render.removeAnimation=function (id, className) {
	this.forceRedraw(id);
	document.querySelector("#"+String(id)).classList.remove(className);
	this.forceRedraw(id);
}


//Event listener to start the Sweet-Scroll when the screen has loaded.
/*document.addEventListener(
    'DOMContentLoaded',
    () => {
      const scroller = new SweetScroll({
      });
    },
	false,
);*/