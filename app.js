function draw(){
    $.get('http://tagtree.tv/feed.json')
    .success(function(episodes){
        d3.select('body')
            .append("ul")
            .selectAll("li")
            .data(episodes)
            .enter()
            .append('li')
            .text(function(d){
                return d.title;
            });

    });
}


$(function(){
    draw();
})