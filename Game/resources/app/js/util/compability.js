function resize() {
    let height=window.innerHeight ;
    let width=window.innerWidth ;
    //console.log("W: "+width+" H:"+height)
    let heightScale=1;
    let widthScale=1;
    let scale=1;
    if(height<960) {
        heightScale=height/960;
    }
    if(width<1280) {
        widthScale=width/1280;
    }
    if(widthScale<heightScale) {
        scale=widthScale;
    }
    else {
        scale=heightScale;
    }
    document.getElementById("screenScaler").style="transform: scale("+scale+");";
    return scale;
    
}
function enableCompabitibility() {
    window.addEventListener('resize', resize);
}
