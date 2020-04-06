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