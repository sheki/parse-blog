// redirect to a random page.
function pickRandomPost() {
  var url = "/x";
  $.ajax({
        type: "GET",
        url: "/sitemap.xml",
        async: false
  })
  .done(function( data ) {
    var posts = [];
    $(data).find("loc").each(function(){
      var loc = $(this).text();
      if (loc.indexOf("/post/") > -1) {
        posts.push(loc);
      }
    });
    var random = posts[Math.floor(Math.random() * posts.length)];
    url = random;
  });
  return url;
}
window.location=pickRandomPost()
