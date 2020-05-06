const DEBUG=true;//Set game side settings
const DEFAULT_UID=true;
const fileCSS=true;
const SYSTEM="WIN";
const defaultHold=1000;

function notify(str, typestr) {//Notify function to display custom console info
	var typeColors={
		"draw": {
			"c":"#fff",
			"b":"#00dc72"
		},
		"update": {
			"c":"#fff",
			"b":"#8300dc"
		},
		"function": {
			"c":"#fff",
			"b":"#b1034b"
		},
		"controls": {
			"c":"#2f3943",
			"b":"#fff40c"
		}
	};
	if(DEBUG==true) {
		if(typeColors[typestr]!=undefined) {
			console.log('%c '+typestr+" %c  "+str, 'background:'+typeColors[typestr]["b"]+'; color:'+typeColors[typestr]["c"]+";", "" );
		}
		else {
			console.log(str);
		}
		
	}
}
