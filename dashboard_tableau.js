var divElement = document.getElementById('viz1740506745131');
var vizElement = divElement.getElementsByTagName('object')[0]; 
if ( divElement.offsetWidth > 800 ) { 
  vizElement.style.width='100%';
  vizElement.style.height=(divElement.offsetWidth*0.75)+'px';
} 
else if ( divElement.offsetWidth > 500 ) { 
  vizElement.style.width='100%';
  vizElement.style.height=(divElement.offsetWidth*0.75)+'px';
} 
else { vizElement.style.width='100%';
  vizElement.style.height='1127px';
}
var scriptElement = document.createElement('script');
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
vizElement.parentNode.insertBefore(scriptElement, vizElement);  