// Add funções para o evento 'window.onload'..

function onLoad(func){
	let oldFunc = window.onload;
	if(!oldFunc)
		window.onload = func;
	else
		window.onload = function(){
			oldFunc();
			func();
		}
}
