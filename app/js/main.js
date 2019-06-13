/* requires */
//=require libs/jquery.min.js
// bootstrap
//=require libs/popper.min.js
//=require ../bootstrap-4.3.1/js/util.js
//=require ../bootstrap-4.3.1/js/collapse.js

// justifiedGallery
//=require libs/justifiedGallery/jquery.justifiedGallery.min.js

/* requires */
$(function () {

  $("#mygallery").justifiedGallery({

    rowHeight : 150,
    lastRow : 'nojustify',
    margins : 3

  });


  function getRandomSize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  for (var i = 0; i < 25; i++) {
    var width = getRandomSize(200, 400);
    var height = getRandomSize(200, 400);

    $('#photos1').append('<img src="//www.lorempixel.com/' + width + '/' + height + '/cats" alt="pretty kitty">');
  }

});