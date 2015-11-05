$(function() {
  // Visual effect on refresh button
  $('body').on('click','.refresh-btn', function() {
    refreshing();
  })

  $('body').on('click','.sport-item', function() {
    refreshing();
  })

  function refreshing() {
    $('.refresh-btn').addClass('refreshing');
    setTimeout(function() {
      $('.refresh-btn').removeClass('refreshing');
    }, 1000);
  }
})