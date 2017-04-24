$('#sidebar').affix({
      offset: {
        top: 10
      }
});

var $body   = $(document.body);
var navHeight = 0; //$('.navbar').outerHeight(true) + 10;

$body.scrollspy({
	target: '#leftCol',
	offset: navHeight
});
