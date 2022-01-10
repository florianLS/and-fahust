
var $progress = $(".progress"),
    $bar = $(".progress__bar"),
    $text = $(".progress__text"),
    percent = 0,
    update,
    resetColors,
    speed = 1000,
    orange = 30,
    yellow = 55,
    green = 85,
    timer;

resetColors = function() {
  
  $bar
    .removeClass("progress__bar--green")
    .removeClass("progress__bar--yellow")
    .removeClass("progress__bar--orange")
    .removeClass("progress__bar--blue");
  
  $progress
    .removeClass("progress--complete");
  
};

update = function() {
  
  timer = setTimeout( function() {

    if($("#contentBody").css("display")=="none"){$("#progress").hide("fast");}else{$("#progress").show("fast");}

    $bar.each(function(){console.log(life)
        if($(this).data("type")=="life") percent = life;
        if($(this).data("type")=="hungry") percent =  hungry;
        if($(this).data("type")=="cleanliness") percent = cleanliness;
        if($(this).data("type")=="moral") percent = moral;
        if($(this).data("type")=="rested") percent = rested;

        $(this).find("em").text($(this).data("type") + " : " + percent + " % ")

        percent = parseFloat(percent.toFixed(1) );
    
    //$text.find("em").text( percent + "%" );

    if( percent >= 100 ) {

      percent = 100;
      //$progress.addClass("progress--complete");
      $(this).addClass("progress__bar--blue");
      //$text.find("em").text( "Complete" );

    } else {
      
      if( percent >= green ) {
        $(this).addClass("progress__bar--green");
      }
      
      else if( percent >= yellow ) {
        $(this).addClass("progress__bar--yellow");
      }
      
      else if( percent >= orange ) {
        $(this).addClass("progress__bar--orange");
      }
      
      speed = Math.floor( Math.random() * 1000 );
      //update();

    }

    $(this).css({ width: percent + "%" });

    })


    

  }, 1000);
  
};

setInterval( function() {
  
  $progress.addClass("progress--active");
  update();
  
},1000);

/*
$(document).on("click",  function(e) {
  
  percent = 0;
  clearTimeout( timer );
  resetColors();
  update();
  
});*/