
function randRang(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

  var rotated = 0;
  setInterval(() => {
      var slides = document.getElementsByClassName("balance-anim");
      for (var i = 0; i < slides.length; i++) {
          if(randRang(1,400)<3){
            var div = slides[i],
                deg = rotated ? -randRang(0,2) : randRang(0,2),
                dataDeg = parseInt(slides[i].dataset.deg);
            div.style.webkitTransform = 'rotate('+(deg*dataDeg)+'deg)'; 
            div.style.mozTransform    = 'rotate('+(deg*dataDeg)+'deg)'; 
            div.style.msTransform     = 'rotate('+(deg*dataDeg)+'deg)'; 
            div.style.oTransform      = 'rotate('+(deg*dataDeg)+'deg)'; 
            div.style.transform       = 'rotate('+(deg*dataDeg)+'deg)'; 
        
            rotated = !rotated;
          }
      }
  }, 10);
  

  
eggRenderImg(0);
eggRenderImg(4);
eggRenderImg(8);

/**
 * Rendu des eggs de card d'achat
 * @param {*} type 
 */
function eggRenderImg(type){
  colorInt = randRang(0,3);
  if(colorInt == 0)color ="blue"
  if(colorInt == 1)color ="green"
  if(colorInt == 2)color ="purple"
  if(colorInt == 3)color ="red"
  type1 = randRang(0,3)+type;
  type1 ="img/eggs/type1/"+color+"/"+(type1+1)+".webp"
  type2 = randRang(0,3)+type;
  type2 ="img/eggs/type2/"+color+"/"+(type2+1)+".webp"
  type3 = randRang(0,3)+type;
  type3 ="img/eggs/type3/"+color+"/"+(type3+1)+".webp"
  type4 = randRang(0,3)+type;
  type4 ="img/eggs/type4/"+color+"/"+(type4+1)+".webp"
  let card = $(".card-fourth");
  let classType = "";
  if(type==4){card = $(".card-third");classType = "";}
  if(type==8){card = $(".card-second");classType = "";}
  card.prepend("<div class='eggLayer' style='transform-origin: bottom center;'>"
  +'<img loading="lazy" src="img/eggs/egg_color'+(((colorInt+1)+(type==0||type==4?0:4)))+'.webp" class="layer-egg '+classType+'" style="height:150px!important;filter: drop-shadow(10px 10px 10px #000);" alt="mystic">'
  +'<img loading="lazy" src="'+type4+'" class="layer-egg" style="height:150px!important;" style="opacity:0.5;" alt="mystic">'
  +'<img loading="lazy" src="'+type3+'" class="layer-egg" style="height:150px!important;" style="opacity:0.8;" alt="mystic">'
  +'<img loading="lazy" src="'+type2+'" class="layer-egg" style="height:150px!important;" alt="mystic">'
  +'<img loading="lazy" src="'+type1+'" class="layer-egg" style="height:150px!important;" style="opacity:0.8;" alt="mystic">'
  +"<div>") 
  
  var rotated = 0;
  setInterval(() => {
      var slides = document.getElementsByClassName("eggLayer");
      for (var i = 0; i < slides.length; i++) {
          
          var div = slides[i],
              deg = rotated ? -randRang(0,2) : randRang(0,2);
      
          div.style.webkitTransform = 'rotate('+deg+'deg)'; 
          div.style.mozTransform    = 'rotate('+deg+'deg)'; 
          div.style.msTransform     = 'rotate('+deg+'deg)'; 
          div.style.oTransform      = 'rotate('+deg+'deg)'; 
          div.style.transform       = 'rotate('+deg+'deg)'; 
      
          rotated = !rotated;
      }
  }, randRang(2000,4900));

}