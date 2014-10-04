var sonido=1;

function cambia_imagen() {
	
	if(sonido!=0){
		document.getElementById('audio').src = "../images/iconos/audio_OFF.png";
		me.audio.muteAll();
		sonido=0;
		return 0;
	}
	
	if(sonido==0){
		document.getElementById('audio').src = "../images/iconos/audio_ON.png";
		me.audio.unmuteAll();
		sonido=1;
		return 0;
	}
	
}