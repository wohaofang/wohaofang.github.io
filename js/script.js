
    //定义画布宽高和生成点的个数
    var WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 35;
    
    var canvas = document.getElementById('Mycanvas');
    canvas.width = WIDTH,
    canvas.height = HEIGHT;
    var context = canvas.getContext('2d');
    context.strokeStyle = 'rgba(0,0,0,0.02)',
    context.strokeWidth = 1,
    context.fillStyle = 'rgba(0,0,0,0.05)';
    var circleArr = [];

    //线条：开始xy坐标，结束xy坐标，线条透明度
    function Line (x, y, _x, _y, o) {
      this.beginX = x,
      this.beginY = y,
      this.closeX = _x,
      this.closeY = _y,
      this.o = o;
    }
    //点：圆心xy坐标，半径，每帧移动xy的距离
    function Circle (x, y, r, moveX, moveY) {
      this.x = x,
      this.y = y,
      this.r = r,
      this.moveX = moveX,
      this.moveY = moveY;
    }
    //生成max和min之间的随机数
    function num (max, _min) {
      var min = arguments[1] || 0;
      return Math.floor(Math.random()*(max-min+1)+min);
    }
    // 绘制原点
    function drawCricle (cxt, x, y, r, moveX, moveY) {
      var circle = new Circle(x, y, r, moveX, moveY)
      cxt.beginPath()
      cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
      cxt.closePath()
      cxt.fill();
      return circle;
    }
    //绘制线条
    function drawLine (cxt, x, y, _x, _y, o) {
      var line = new Line(x, y, _x, _y, o)
      cxt.beginPath()
      cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'
      cxt.moveTo(line.beginX, line.beginY)
      cxt.lineTo(line.closeX, line.closeY)
      cxt.closePath()
      cxt.stroke();

    }
    //初始化生成原点
    function init () {
      circleArr = [];
      for (var i = 0; i < POINT; i++) {
        circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10)/40, num(10, -10)/40));
      }
      draw();
    }

    //每帧绘制
    function draw () {
      context.clearRect(0,0,canvas.width, canvas.height);
      for (var i = 0; i < POINT; i++) {
        drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
      }
      for (var i = 0; i < POINT; i++) {
        for (var j = 0; j < POINT; j++) {
          if (i + j < POINT) {
            var A = Math.abs(circleArr[i+j].x - circleArr[i].x),
              B = Math.abs(circleArr[i+j].y - circleArr[i].y);
            var lineLength = Math.sqrt(A*A + B*B);
            var C = 1/lineLength*7-0.009;
            var lineOpacity = C > 0.03 ? 0.03 : C;
            if (lineOpacity > 0) {
              drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity);
            }
          }
        }
      }
    }

    //调用执行
    window.onload = function () {
      init();
      setInterval(function () {
        for (var i = 0; i < POINT; i++) {
          var cir = circleArr[i];
          cir.x += cir.moveX;
          cir.y += cir.moveY;
          if (cir.x > WIDTH) cir.x = 0;
          else if (cir.x < 0) cir.x = WIDTH;
          if (cir.y > HEIGHT) cir.y = 0;
          else if (cir.y < 0) cir.y = HEIGHT;
          
        }
        draw();
      }, 16);
    }


(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });
})(jQuery);