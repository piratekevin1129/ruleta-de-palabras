var i = 0
var j = 0
var k = 0

function getRand(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function unorderArray(lon){
	while(unorder_array.length<lon){
		var n = getRand(1,lon)
		if(!unorder_array.includes(n)){
			unorder_array.push(n)
		}
	}
}

var game_width = 845
var game_height = 507
var canvas_width = 300
var letras_ruleta = []
var letras_ruleta_saltadas = []
var letras_ruleta_aprobadas = []
var letras_ruleta_reprobadas = []
var letters_rulette = []
var palabras_ruleta = []
var radius_rulette = 0

function d2R(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}

var animacion_letra_entrada = null
function setGame(){
	canvas.width = canvas_width
	canvas.height = canvas_width
	radius_rulette = canvas_width/2
	palabras_ruleta = global_data.palabras

	var angulo = 360/palabras_ruleta.length
	for(i = 0;i<palabras_ruleta.length;i++){
		var angle = (angulo*i)-90
		var x = radius_rulette*Math.cos(d2R(angle))
		var y = radius_rulette*Math.sin(d2R(angle))
		var posx = x+radius_rulette
		var posy = y+radius_rulette
		//console.log(x,y)
		var l = document.createElement('div')
		l.className = 'rulette-letra-icon rulette-letra-icon-off'
		l.innerHTML = '<div><p>'+palabras_ruleta[i].letra+'</p></div>'
		l.style.left = posx+'px'
		l.style.top = posy+'px'
		getE('rulette-letras').appendChild(l)
		letras_ruleta.push(l)
	}

	
}

function prepareGame(){
	i = 0
	getE('rulette').classList.remove('rulette-out')
	getE('rulette').classList.add('rulette-in')

	animacion_letra_entrada = setInterval(function(){
		if(i==letras_ruleta.length){
			clearInterval(animacion_letra_entrada)
			animacion_letra_entrada = null

			//quitar clase on para prevenir animacion
			animacion_ruleta_start = setTimeout(function(){
				clearTimeout(animacion_ruleta_start)
				animacion_ruleta_start = null

				for(i = 0;i<letras_ruleta.length;i++){
					letras_ruleta[i].classList.remove('rulette-letra-icon-on')
				}

				letra_aleatoria = getRand(0,(letras_ruleta.length-1))

				resetRuleta()
				animacion_ruleta = setInterval(rodarRuleta,30)
			},200)
			
		}else{
			letras_ruleta[i].classList.remove('rulette-letra-icon-off')
			letras_ruleta[i].classList.add('rulette-letra-icon-on')
			i++
		}
	},50)	
}

var r = 0
var rotacion = 0
var aceleracion = 5
var frame = 0
var delay = 20
var vueltas = 0
var animacion_ruleta = null
var animacion_ruleta_start = null
var letra_aleatoria = 0
var terminado = false

function resetRuleta(){
	rotacion = 0
	aceleracion = 5
	frame = 0
	delay = 20
	vueltas = 0
	sonido_ruleta = false
	canvas.className = 'rulette-letter-off'
}

var sonido_ruleta = false
function rodarRuleta(){
	//console.log(frame,delay)
	if(frame==delay){
		if(!sonido_ruleta){
			ruleta_effect.volume = 1
			ruleta_effect.currentTime = 0
			ruleta_effect.play()
			sonido_ruleta = true
		}
		//if(!letras_ruleta_aprobadas.includes(r)&&!letras_ruleta_reprobadas.includes(r)){
			letras_ruleta[r].classList.add('rulette-letra-icon-over')
			/*if(r%2==0){
				over_letra_mp3.currentTime = 0
				over_letra_mp3.play()
			}else{
				over_letra_mp4.currentTime = 0
				over_letra_mp4.play()
			}*/
		//}
		
		if(r==0){
			letras_ruleta[letras_ruleta.length-1].classList.remove('rulette-letra-icon-over')
			vueltas++
		}else{
			letras_ruleta[r-1].classList.remove('rulette-letra-icon-over')
		}

		if(delay>1){
			delay-=aceleracion
			aceleracion--
			if(aceleracion<1){
				aceleracion = 1
			}
		}
		//console.log(delay)

		if(r==letra_aleatoria&&vueltas==2){
			clearInterval(animacion_ruleta)
			animacion_ruleta = null

			setPregunta()//en realidad no es pregunta pero bueno
		}

		r++
		if(r==letras_ruleta.length){
			r = 0
		}
		frame = 0
	}else{
		frame++
	}
}

var animacion_entrada = null
var canvas = getE('rulette-letter')
var ctx = canvas.getContext('2d');

function setPregunta(){
	pauseRuletaSound()

	letras_ruleta[letra_aleatoria].classList.remove('rulette-letra-icon-over')
	letras_ruleta[letra_aleatoria].classList.add('rulette-letra-icon-active')

	getE('rulette').className = "rulette-off"
	animacion_entrada = setTimeout(function(){
		clearTimeout(animacion_entrada)
		animacion_entrada = null

		ctx.clearRect(0,0,canvas.width,canvas.height)
		ctx.font = 'bold 150px Quicksand'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillStyle = '#404E67'
		ctx.fillText(String(palabras_ruleta[letra_aleatoria].letra).toUpperCase(),(canvas.width/2),(canvas.height/2))
		
		getE('informacion-title').innerHTML = 'Empieza por la <span>'+String(palabras_ruleta[letra_aleatoria].letra).toUpperCase()+'</span>'
		getE('informacion-description').innerHTML = palabras_ruleta[letra_aleatoria].pista
		getE('informacion').className = 'informacion-on'
		canvas.className = 'rulette-letter-on'
		if(saltar_btn.className.indexOf('unlocked')!=-1){
			saltar_btn.disabled = false
		}
		getE('palabra-input').value = ''
		comprobar_btn.disabled = false
	},1000)
}

var animacion_ruleta_sound = null
function pauseRuletaSound(){
	var vol_ruleta = 1
	animacion_ruleta_sound = setInterval(function(){
		vol_ruleta-=0.2
		if(vol_ruleta<0){
			clearInterval(animacion_ruleta_sound)
			animacion_ruleta_sound = null
		}else{
			ruleta_effect.volume = vol_ruleta
		}
	},100)
}

var saltar_btn = getE('saltar-btn')
var comprobar_btn = getE('comprobar-btn')
saltar_btn.disabled = true
comprobar_btn.disabled = true

function saltarPalabra(){
	//bloquear botones
	saltar_btn.disabled = true
	comprobar_btn.disabled = true

	//poner letra en saltada
	letras_ruleta[letra_aleatoria].classList.remove('rulette-letra-icon-active')
	letras_ruleta_saltadas.push(letra_aleatoria)

	if(!terminado){
		if(letras_ruleta_aprobadas.length+letras_ruleta_reprobadas.length+letras_ruleta_saltadas.length==letras_ruleta.length){
			terminado = true
		}
	}
	
	continueRuleta(false)
}

var intentos = 0
function comprobarPalabra(){
	var value_0 = getE('palabra-input').value
	var value_1 = value_0.trim().toLowerCase()
	var value_2 = removeAcentos(value_1)

	if(value_2==""){
		getE('error_txt').className = 'error_txt_on'
	}else{
		//bloquear botones
		saltar_btn.disabled = true
		comprobar_btn.disabled = true

		var is_word = false
		var list = palabras_ruleta[letra_aleatoria].palabra
		for(i = 0;i<list.length;i++){
			var value_3 = list[i]
			var value_4 = value_3.trim().toLowerCase()
			var value_5 = removeAcentos(value_4)
			if(value_5==value_2){
				is_word = true
			}
		}

		if(is_word){
			//aprobar
			correcto_mp3.play()
			letras_ruleta_aprobadas.push(letra_aleatoria)
			letras_ruleta[letra_aleatoria].classList.remove('rulette-letra-icon-active')
			letras_ruleta[letra_aleatoria].classList.add('rulette-letra-icon-approved')
			continueRuleta(true)
		}else{
			//reprobar
			incorrecto_mp3.play()
			palabras_ruleta[letra_aleatoria].respuesta = value_2
			letras_ruleta_reprobadas.push(letra_aleatoria)
			letras_ruleta[letra_aleatoria].classList.remove('rulette-letra-icon-active')
			letras_ruleta[letra_aleatoria].classList.add('rulette-letra-icon-failed')

			var stars = getE('tra_estrellas').getElementsByClassName('tra_estrella')
			//quitar estrella
			stars[intentos].classList.remove('tra_estrella_off')
			stars[intentos].classList.add('tra_estrella_on')
			
			intentos++

			if(intentos==numero_intentos){
				pararReloj()
				setModal({msg:'<span>'+titulo_final_mal+'</span> '+mensaje_final_mal+'<br />Puedes hacer clic en el botón <span>Reiniciar</span> para jugar de nuevo',close:true})
			}else{
				continueRuleta(true)
			}
		}
	}
}

function removeAcentos(str){
	var str1 = str.replace(new RegExp('á','g'),'a')
	var str2 = str1.replace(new RegExp('é','g'),'e')
	var str3 = str2.replace(new RegExp('í','g'),'i')
	var str4 = str3.replace(new RegExp('ó','g'),'o')
	var str5 = str4.replace(new RegExp('ú','g'),'u')
	return str5
}

function continueRuleta(check){
	console.log("continuar")
	if(check){
		if(!terminado){
			if(letras_ruleta_aprobadas.length+letras_ruleta_reprobadas.length+letras_ruleta_saltadas.length==letras_ruleta.length){
				terminado = true
			}
		}
	}

	getE('informacion').className = 'informacion-off'

	if(letras_ruleta_saltadas.length==0&&terminado){
		//se queda en la izquierda
	}else{	
		getE('rulette').className = "rulette-on"
	}

	$("html, body").animate({ scrollTop: $('#tra_body').offset().top }, 500);

	animacion_entrada = setTimeout(function(){
		clearTimeout(animacion_entrada)
		animacion_entrada = null
		
		if(letras_ruleta_saltadas.length==0&&terminado){
			//no hay letras saltadas
			//alert("terminamos")
			setFinal()
		}else{
			//tirar una letra de las normales de la lista o de las saltadas
			if(terminado){
				//tirar una letra del array saltadas
				saltar_btn.className = 'saltar-btn-locked'
				saltar_btn.disabled = true

				var l_a = getRand(0,(letras_ruleta_saltadas.length-1))
				letra_aleatoria = letras_ruleta_saltadas[l_a]
				console.log(letras_ruleta_saltadas)

				//quitar la letra de palabras saltadas
				var nuevas_saltadas = []
				for(k = 0;k<letras_ruleta_saltadas.length;k++){
					if(k!=l_a){
						nuevas_saltadas.push(letras_ruleta_saltadas[k])
					}
				}
				letras_ruleta_saltadas = nuevas_saltadas
				console.log(letras_ruleta_saltadas)

				//letra aleatoria a partir de ahora debe ser una de las saltadas
			}else{
				//tirar una letra del array normales
				letra_aleatoria = getRand(0,(letras_ruleta.length-1))
				var check_letra = checkLetra(letra_aleatoria)
				while(!check_letra){
					letra_aleatoria = getRand(0,(letras_ruleta.length-1))
					check_letra = checkLetra(letra_aleatoria)
				}
				
			}
			resetRuleta()
			animacion_ruleta = setInterval(rodarRuleta,30)
		}
		
	},1000)
}

function checkLetra(l){
	var valid = false
	var saltado = letras_ruleta_saltadas.includes(l)
	var aprobado = letras_ruleta_aprobadas.includes(l)
	var reprobado = letras_ruleta_reprobadas.includes(l)

	if(saltado||aprobado||reprobado){
		valid = false
	}else{
		valid = true
	}
	return valid
}

function setFinal(){
	console.log(letras_ruleta_aprobadas)
	console.log(letras_ruleta_reprobadas)

	getE('aciertos_txt').innerHTML = letras_ruleta_aprobadas.length+'/'+letras_ruleta_reprobadas.length
	var resultado = (letras_ruleta_aprobadas.length*100)/letras_ruleta.length

	getE('puntaje_txt').innerHTML = String(Math.floor(resultado*10)/10)+'%'
	pararReloj()

	//fill tabla
	for(i = 0;i<palabras_ruleta.length;i++){
		var le = palabras_ruleta[i].letra
		var pas = palabras_ruleta[i].palabra
		var des = palabras_ruleta[i].pista
		var res = ''

		var row = document.createElement('div')
		row.id = 'palabra-stat-info-'+i
		if(letras_ruleta_aprobadas.includes(i)){
			//correcta
			row.className = 'tabla-stats-palabra tabla-stats-palabra-collapsed tabla-stats-correct'
		}else{
			res = palabras_ruleta[i].respuesta
			row.className = 'tabla-stats-palabra tabla-stats-palabra-collapsed tabla-stats-incorrect'
		}

		var html = ''
        html+='<div class="tabla-stats-palabra-header">'
            html+='<div class="tabla-stats-palabra-icon" onclick="togglePalabraInfo('+i+')"></div>'
            html+='<div class="tabla-stats-palabra-letra">'+le+'</div>'
            html+='<div class="tabla-stats-palabra-results">'
                html+='<div class="tabla-stats-palabra-incorrect"><p>'+res+'</p></div>'
                for(j = 0;j<pas.length;j++){
                	html+='<div class="tabla-stats-palabra-correct"><p>'+pas[j]+'</p></div>'
                }
            html+='</div>'
        html+='</div>'
        html+='<div class="tabla-stats-palabra-body">'
            html+='<div class="tabla-stats-palabra-description">'
                html+='<p>'+des+'</p>'
            html+='</div>'
        html+='</div>'
        row.innerHTML = html
        getE('tabla-stats').appendChild(row)
	}
	getE('tabla').className = 'tabla-on'
}

function togglePalabraInfo(p){
	var row = getE('palabra-stat-info-'+p)
	var clase = row.className
	if(clase.indexOf('collapsed')!=-1){
		//expandir
		row.classList.remove('tabla-stats-palabra-collapsed')
		row.classList.add('tabla-stats-palabra-expanded')
	}else{
		//colapsar
		row.classList.remove('tabla-stats-palabra-expanded')
		row.classList.add('tabla-stats-palabra-collapsed')
	}
}

function focusPalabra(){
	getE('palabra-input-lines').className = 'palabra-input-lines-on'
} 
function blurPalabra(){
    getE('palabra-input-lines').className = 'palabra-input-lines-off'
}
function keyupPalabra(input){
	var v = input.value
	if(v.trim()!=""){
		getE('error_txt').className = 'error_txt_off'
	}
}

/**********MODALES***********/
var animacion_modal_delay = null
var animacion_modal_autoclose = null
function setModal(params){
	var msg = params.msg
	var icon = 'error'
	var close = true
	if(params.icon!=null&&params.icon!=undefined){
		icon = params.icon
	}
	if(params.close!=null&&params.close!=undefined){
		close = params.close
	}

	if(icon=='success'){
		document.getElementById('modal-icon-msg').className = 'modal-icon-msg-success'
	}else{
		document.getElementById('modal-icon-msg').className = 'modal-icon-msg-error'
	}
	if(close){
		document.getElementById('modal-close-msg').style.visibility = 'visible'
	}else{
		document.getElementById('modal-close-msg').style.visibility = 'hidden'
	}

	var continue_btn = ''
	var msg_full = '<p>'+msg+'</p>'
	if(params.continue!=null&&params.continue!=undefined){
		continue_btn+='<button class="modal-continue-btn" onmouseover="overContinue()" onclick="'+params.action+'()">'+params.label+'</button>'
		msg_full+=continue_btn
	}

	document.getElementById('modal-text-msg').innerHTML = msg_full

	victoria_mp3.play()

	if(params.delay!=null&&params.delay!=undefined){
		animacion_modal_delay = setTimeout(function(){
			clearTimeout(animacion_modal_delay)
			animacion_modal_delay = null

			document.getElementById('modal').className = 'modal-on'
		},params.delay)
	}else{
		document.getElementById('modal').className = 'modal-on'
	}

	if(params.autoclose!=null&&params.autoclose!=undefined){
		animacion_modal_autoclose = setTimeout(function(){
			clearTimeout(animacion_modal_autoclose)
			animacion_modal_autoclose = null

			unsetModal()
		},params.autoclose)
	}
}

function overContinue(){
	button_mp3.play()
}

function unsetModal(){
	if(animacion_modal_delay!=null){
		clearTimeout(animacion_modal_delay)
		animacion_modal_delay = null
	}
	if(animacion_modal_autoclose!=null){
		clearTimeout(animacion_modal_autoclose)
		animacion_modal_autoclose = null
	}
	document.getElementById('modal').className = 'modal-off'
}

function openInstrucciones(){
	instrucciones.className = 'instrucciones-on'
}

function closeInstrucciones(){
	if(first_instrucciones){
		first_instrucciones = false
		
		//underground_mp3.play()
		setTimer()
		j = 0
		prepareGame()
		
	}
	instrucciones.className = 'instrucciones-off'
}

var first_instrucciones = true

function setTimer(){
	iniciarReloj()
}

function getE(idname){
	return document.getElementById(idname)
}

function reloadGame(){

}

function nextTema(){

}