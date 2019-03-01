/* (C) Sergey Roganov aka belomir, 2019 */

var feb23 = new rsa.Holyday({

	name: 'feb23',

	check(date){
		return date.getMonth()+1==2 && date.getDate()>=22 && date.getDate()<=24;
	},

	run(){
		this.init = this.init || $(()=>{
			this.time = 15;
			$('body').css({position: 'relative'});
			this.background = $('<div>')
				.attr('data-rsa', this.name)
				.css({
					background: `url(${rsa.link('feb23.jpg')})`,
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					zIndex: -100,
					pointerEvents: 'none',
					padding: 0,
					overflow: 'hidden',
					opacity: 0,
					transition: `all ${this.time}s`
				})
				.prependTo('body');
			this.foreground = $('<div>')
				.attr('data-rsa', this.name)
				.css({
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					zIndex: +100,
					pointerEvents: 'none',
					padding: 0,
					overflow: 'hidden',
					opacity: 0,
					transition: `all ${this.time}s`
				})
				.appendTo('body');
			$('head').append(
				$('<style>')
					.html(`/* rsa 23 february */
@keyframes rsa-feb23 {
	0% {opacity: 1}
	5% {opacity: 1}
	15% {opacity: 0}
	100% {opacity: 0}
}`)
			);
			/* glass */
			for(var i=0; i<4+5*Math.random(); i++){
				$('<img>')
					.attr('src', rsa.link('feb23_glasshole.png'))
					.css({
						position: 'absolute',
						left: `${90*Math.random()}%`,
						top: `${90*Math.random()}%`,
						width: `${2+3*Math.random()}em`,
						transform: `rotate(${-45+90*Math.random()}deg)`,
						pointerEvents: 'none',
						opacity: 0,
						animation: `rsa-feb23 ${30+60*Math.random()}s ${this.time+60*Math.random()}s infinite`,
						'animation-play-state': 'paused',
					})
					.appendTo(this.foreground);
			}
			/* singles */
			for(var i=0; i<4+5*Math.random(); i++){
				$('<div>')
					.css({
						position: 'absolute',
						left: `${90*Math.random()}%`,
						top: `${90*Math.random()}%`,
						background: `url(${rsa.link('feb23_10holes.png')}) -${Math.floor(Math.random()*5)*50}px -${Math.floor(Math.random()*2)*50}px`,
						width: '50px',
						height: '50px',
						transform: `rotate(${-45+90*Math.random()}deg)`,
						pointerEvents: 'none',
						opacity: 0,
						animation: `rsa-feb23 ${30+60*Math.random()}s ${this.time+60*Math.random()}s infinite`,
						'animation-play-state': 'paused',
					})
					.appendTo(this.foreground);
			}
			/* queue */
			for(var i=0; i<2+4*Math.random(); i++){
				var W = parseInt($('body').css('width'));
				var H = parseInt($('body').css('height'));
				var sx = W*Math.random();
				var sy = H*Math.random();
				var dr = 50+150*Math.random();
				var da = 2*Math.PI*Math.random();
				var dx = dr*Math.cos(da);
				var dy = dr*Math.sin(da);
				var dur = 30+60*Math.random();
				var del = this.time+60*Math.random();
				var dt = .00625+.3*Math.random();
				for(var j=0; j<4+6*Math.random(); j++){
					$('<div>')
						.css({
							position: 'absolute',
							left: `${sx+dx*j}px`,
							top: `${sy+dy*j}px`,
							background: `url(${rsa.link('feb23_10holes.png')}) -${Math.floor(Math.random()*5)*50}px -${Math.floor(Math.random()*2)*50}px`,
							width: '50px',
							height: '50px',
							transform: `rotate(${-45+90*Math.random()}deg)`,
							pointerEvents: 'none',
							opacity: 0,
							animation: `rsa-feb23 ${dur}s ${del+j*dt}s infinite`,
							'animation-play-state': 'paused',
						})
						.appendTo(this.foreground);
				}
			}
		});

		$('.block:not(:has([data-rsa=html])), li.section').css({transition: 'background 1s'});

		$('.block:not(:has([data-rsa=html]))').css({background: 'rgba(255, 255, 255, .75)'});
		$('li.section:not(.current)').css({background: 'rgba(255, 255, 255, .75)'});
		$('li.section.current').css({background: 'rgba(217, 237, 247, .75)'});
		this.background.css({opacity: .7});
		this.foreground.css({opacity: .8})
			.children().css('animation-play-state', 'running');

		rsa.log(`${this.name} is running`);
	},

	stop(){
		$('.block:not(:has([data-rsa=html])), li.section').css({background: ''});
		this.background.css({opacity: 0});
		this.foreground.css({opacity: 0})
			.children().css('animation-play-state', 'paused');

		rsa.log(`${this.name} stopped`);
	}
});
