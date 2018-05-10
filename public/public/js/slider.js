function URSlider(options) {
  var me = this,
      items = [],
      sliderElement,
      index = 0,
      current,
      currentElement,
      nextElement,
      stopped;

  this.add = function(item) {
    items.push($.extend({}, item));
  };

  this.stop = function() {
    stopped = true;
  };

  function load() {
    if (!items || !items.length) return;

    sliderElement = $(options.element);

    sliderElement.css('position', 'relative');
    sliderElement.css('width', options.width);
    sliderElement.css('max-width', options.width);
    sliderElement.css('max-height', options.height);
    sliderElement.css('overflow', 'hidden');

    sliderElement.html('<div class="ur-slider-current"></div><div class="ur-slider-next"></div>');

    currentElement = $('.ur-slider-current');
    nextElement = $('.ur-slider-next');

    currentElement.css('position', 'absolute');
    currentElement.css('width', '100%');
    currentElement.css('height', '100%');
    currentElement.css('top', 0);
    currentElement.css('left', 0);
    currentElement.css('z-index', 9002);

    nextElement.css('position', 'absolute');
    nextElement.css('width', '100%');
    nextElement.css('height', '100%');
    nextElement.css('top', 0);
    nextElement.css('left', 0);
    nextElement.css('z-index', 9001);

    selectNext.call(this);
  }

  var first = true;

  function generateContent(item) {
    if (item.contentPosition !== 'center') {
      extraStyles = 'float: ' + item.contentPosition + ';';
    } else {
      extraStyles = 'margin-left: auto; margin-right: auto;';
    }

    var div = '<a href="' + item.link + '">';

    div += '<div class="ur-slider-content-wrapper" style="text-align: ' + item.contentPosition + ';' + extraStyles + '; display: none;">';
    div += '<div class="ur-slider-content-headline" style="' + extraStyles + '">';
    div += item.headline;
    div += '</div>';
    div += '</div>';

    if (item.text && item.text.length) {
      div += '<div class="ur-slider-content-wrapper" style="text-align: ' + item.contentPosition + ';' + extraStyles + '; display: none;">';
      div += '<div class="ur-slider-content-text" style="' + extraStyles + '">';
      div += item.text;
      div += '</div>';
      div += '</div>';
    }

    div += '</a>';
    div += '<div class="ur-clear"></div>';

    return div;
  }

  function selectNext() {
    if (stopped) return;

    current = items[index];

    index++;

    if (index >= items.length) {
      index = 0;
    }

    currentElement.fadeOut(800, function() {
      currentElement.css('background-image', 'url(' + current.image + ')');

      currentElement.html(generateContent(current));

      currentElement.fadeIn(200, function() {
        var next = items[index];

        nextElement.css('background-image', 'url(' + next.image + ')');

        $('.ur-slider-content-wrapper').slideDown(400);

        nextElement.html(generateContent(next));

        setTimeout(function() {
          selectNext();
        }, options.delay);
      });
    });
  }

  $(document).ready(function() {
    load.call(me);
  });
}
