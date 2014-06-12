function draw(data){
    var container_dimensions = {
        width:900,
        height: 900
    };

    var margins = {
        top:10,
        right: 20,
        bottom: 30,
        left:60
    };

    var chart_dimensions = {
        width: container_dimensions.width - margins.left - margins.right,
        height: container_dimensions.height - margins.top - margins.bottom
    };

    var chart = d3.select('#timeseries')
        .append('svg')
        .attr('width', container_dimensions.width)
        .attr('height', container_dimensions.height)
        .append('g')
        .attr('id', 'chart')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top +  ')');

    var date_extent = d3.extent(data.view_counts, function(d){return d.date;});
    var count_extent = d3.extent(data.view_counts, function(d){return d.sum;});

    console.log(date_extent);
    console.log(count_extent);

    var date_scale = d3.time.scale()
        .range([0, chart_dimensions.width])
        .domain(date_extent);

    var date_axis = d3.svg.axis().scale(date_scale);

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + chart_dimensions.height + ')')
        .call(date_axis);

    var count_scale = d3.scale.linear()
        .range([chart_dimensions.height, 0])
        .domain(count_extent);

    var count_axis = d3.svg.axis().scale(count_scale)
        .orient('left');

    chart.append('g')
        .attr('class', 'y axis')
        .call(count_axis);


    var color = d3.scale.category20();
    var videos_with_colors = _(data.videos)
        .map(function(v, i){
            return {
                video: v,
                color: color(i)
            };
        })
        .indexBy(function(v){
            return v.video;
        })
        .value();

    var key_items = d3.select("#key")
        .selectAll('div')
        .data(data.videos)
        .enter()
        .append('div')
        .attr('class', 'key_item')
        .style('color', function(v){
            return videos_with_colors[v].color;
        })
        .text(function(v){
            return v;
        });



    var line = d3.svg.line()
        .x(function(d){return date_scale(d.date);})
        .y(function(d){return count_scale(d.sum);})
        .interpolate('step-closed');

    function addVideoSeries(video, i){
        var video_data = data.view_counts.filter(function(vc){return vc.video === video;});
        var joined_video_name = video.replace(/\s/g, '_');
        var video_color = videos_with_colors[video].color;

        var g = chart.append('g')
            .attr('id', joined_video_name + '_path')
            .attr('class', joined_video_name + ' series_path');

        g.selectAll('circle')
            .data(video_data)
            .enter()
            .append('circle')
            .attr('cx', function(d){return date_scale(d.date);})
            .attr('cy', function(d){return count_scale(d.sum);})
            .attr('r', 0)
            .attr('fill', function(d, i){return video_color;})
            .attr('stroke', 'none')
            .on('mouseover', function(){
                d3.select(this)
                    .transition()
                    .attr('r', 9);
            })
            .on('mouseout', function(){
                d3.select(this)
                    .transition()
                    .attr('r', 5);
            });

        g.selectAll('circle')
            .transition()
            .delay(function(d, i){
                return i / video_data.length * 1000;
            })
            .attr('r', 5);





        g.append('path')
            .attr('d', line(video_data))
            .attr('stroke', video_color);

    }

    _(data.videos).each(addVideoSeries).value();


}

d3.json('data.json', draw);













