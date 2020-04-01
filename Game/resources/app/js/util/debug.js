const DEBUG=true;
function notify(str, typestr) {
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