function draw(data){
    var layout_gravity = -0.02, damper = 0.1;


    var chart_dimensions = {
        width: 1000,
        height: 700
    };

    var center = {
        x: chart_dimensions.width / 2,
        y: chart_dimensions.height / 2
    };


    var chart = d3.select('#container')
        .append('svg')
        .attr('width', chart_dimensions.width)
        .attr('height', chart_dimensions.height)
        .append('g')
        .attr('id', 'chart');

    var max = d3.max(data, (d)=> d.view_count);
    //var fill =   d3.scale.ordinal().range(['#827d92'...'#2a3285','#383435'])

    var scale = d3.scale
        .pow()
        .exponent(1)
        .domain([0, max])
        .range([20 , 100]);

    var tech_colors = {
        es6: '#f0db4e',
        node: '#8cc84b',
        mv: '#bd473d',
        graphics: '#f19d45'
    }

    _.each(data, function (d) {
        d.radius = scale(d.view_count);
        d.y = Math.random() * chart_dimensions.height;
        d.x = Math.random() * chart_dimensions.width;
        d.tech = d.tech.split(' ');
        d.color = tech_colors[_(tech_colors).keys().find(function(k){
            return d.tech.indexOf(k) > -1;
        })] || '#3c475a';
    });



    var nodes  = chart.selectAll('.node')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'node');

    var circles = nodes
        .append('circle')
        .attr('r', 0)
        .attr('fill', (d) => d.color)
        .attr('stroke-width', 2)
        .attr('stroke', '#fff')
        .attr('cx', (d)=> d.x)
        .attr('cy', (d)=> d.y)
        .on("mouseover", (d,i) => {
            d3.select('#key')
                .text(d.title)
                .style('color', d.color);

            d3.select(this)
                .transition()
                .attr('r', (d)=> d.radius * 2);
        });


    var labels = nodes
        .append('text')
        .attr('class', 'label')
        .text((d)=> d.view_count);

    // console.log(circles);

    circles.transition()
            .duration(2000)
            .attr("r", (d) => d.radius);


    function moveTowardsCenter(alpha){
        return function(d){
            d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha.alpha;
            d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha.alpha;
            return d;
        }
    }

    var force = d3.layout.force()
        .nodes(data)
        .size([chart_dimensions.width, chart_dimensions.height])
        .gravity(layout_gravity)
        .charge((d)=>  -Math.pow(d.radius, 2.0) / 7)
        .friction(0.9)
        .on('tick', function(alpha){
            nodes.each(moveTowardsCenter(alpha));

            circles
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y);

            labels
                .attr("x", (d) => d.x - d.radius/3)
                .attr("y", (d) => d.y);
        })
        .start();




//     var aspect = 960 / 500,
//         chart = $("#chart");

//     $(window).on("resize", function() {
//         var targetWidth = chart.parent().width();
//         chart.attr("width", targetWidth);
//         chart.attr("height", targetWidth / aspect);
//     });
 }

d3.json('http://tagtree.tv/feed.json', draw);













