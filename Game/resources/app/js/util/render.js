var render={};

render.fade={
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
render.footer={

};
render.forceRedraw=function(element) {
  element.offsetHeight;
};
//Sweet-Scroll
document.addEventListener(
    'DOMContentLoaded',
    () => {
      const scroller = new SweetScroll({
        /* some options */
      });
    },
    false,
  );

  /*function setScrollHeight (wrapperDiv, textDiv, basePrefix, itemId) {
	notify("wrapperDiv: "+wrapperDiv+ " textDiv: "+textDiv+ " basePrefix: "+ basePrefix+" itemId:"+itemId, "function");
	var scrollDistance = (-1 *document.getElementById(textDiv).clientHeight) +document.getElementById(wrapperDiv).clientHeight;
	var time=0;
	if (scrollDistance<MIN_SCROLL_REQUIREMENT) {
		time=Math.abs(scrollDistance)/SCROLL_PIXELS_PER_SECOND+(SCROLL_WAITTIME*2);
		var keyframes=
		`@keyframes _`+basePrefix+itemId+`
		{
			0%{opacity: 0;transform:translateY(0);}
			`+((SCROLL_FADETIME/time)*100)+`%{opacity: 1;}
			`+((SCROLL_WAITTIME/time)*100)+`%{transform:translateY(0);}
			`+(100-((SCROLL_WAITTIME/time)*100))+`%{transform:translateY(`+scrollDistance+`px);}
			`+(100-((SCROLL_FADETIME/time)*100))+`%{opacity: 1; transform:translateY(`+scrollDistance+`px);}
			100%{opacity: 0;transform:translateY(`+scrollDistance+`px);}
		}`;
		var style='animation:_'+basePrefix+itemId+' '+time+'s linear infinite';
		document.getElementById(basePrefix+'-s').innerHTML=keyframes;
		document.getElementById(textDiv).style.cssText=style;
		notify("time:"+ time, "draw");
		notify("dis:"+ scrollDistance, "draw");
		notify("abs dis:"+ Math.abs(scrollDistance), "draw");
		notify("ratio:"+ Math.abs(scrollDistance)/SCROLL_PIXELS_PER_SECOND, "draw");
		notify("calc: "+ (SCROLL_FADETIME/time), "draw");
	}
	else {
		document.getElementById(basePrefix+'-s').innerHTML="";
	}
	return time;
}*/