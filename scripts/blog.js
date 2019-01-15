
    $.ajax({
        url: "https://api.tumblr.com/v2/blog/mluebbers.tumblr.com/posts?api_key=3djnNPx3M3rUZR5qdmzqAeHopZn1UyMI66GA1q9TWWui8Zht17",
        dataType: 'jsonp',
        error: function(){
            let text = 'Notes could not be retrieved.';
            $('#blog').append(text);
            $('#blog-link').addClass('error');
        },
        success: function(posts){
            let postings = posts.response.posts;
            let text = '';
            let lastDate = '';
            

            for (let i in postings) {

                let p = postings[i];
                let truncatedDate = p.date.substring(0,7);
                text += '<p></p>';

                if(lastDate != truncatedDate){
                    text += '<div class="post-date tumblr-date" ><span>' + truncatedDate + '</span></div>';
                    lastDate = truncatedDate;
                }
                
                if(p.type == 'photo'){
                    text +='<img class="tumblr-img" src=' +  p.photos[0].original_size.url + '>' + p.caption
                    text += '<br><a class="tumblr-link" href='+ p.post_url +'>'+ p.post_url +'</a></li>';
                }
                if(p.type == 'video'){
                    text += '<div class="video-container">' + p.player[0].embed_code + '</div>' +'<p></p>' + p.caption;
                }
                if(p.type == 'text'){
                    text += '<h1 class="tumblr-header">' + p.title + '</h1>';
                    text += '<p class="tumblr-text">' +  p.body + '</p>';
                    text += '<br><a class="tumblr-link" href='+ p.post_url +'>'+ p.post_url +'</a></li>';
                }
                
                text += '<br></br><br></br>';
            }
            $('#blog').append(text);
        }
    });

    toBlog = function(){
        $('#all-container').css("transform", "translateY(-100vh)");
    }
    toMain = function(){
        $('#all-container').css("transform", "translateY(0vh)");
    }