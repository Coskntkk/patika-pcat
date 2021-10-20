$(document).ready(function() {
  $('.tm-likes-box').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('tm-liked');

    if ($(this).hasClass('tm-liked')) {
      $('#tm-likes-count').html('486 likes');
    } else {
      $('#tm-likes-count').html('485 likes');
    }
  });
});
