/* (C) Sergey Roganov aka belomir, 2019 */

var feb14 = new rsa.Holyday({

	name: 'feb14',

	check(date){
		return date.getMonth()+1==2&&date.getDate()==14;
	},

	run(){
		this.init = this.init || $(()=>{
			$('body').css({position: 'relative'});
			this.background = $('<div>')
				.attr('data-rsa', this.name)
				.css({
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					zIndex: -100,
					pointerEvents: 'none',
					overflow: 'hidden',
					opacity: 0,
					transition: 'opacity 1s'
				})
				.prependTo('body');
			$('head').append(
				$('<style>')
					.html(`/* rsa 14 february */
@keyframes rsa-feb14 {
	0% {opacity: 1}
	15% {opacity: 0}
	100% {opacity: 0}
}`)
			);
			for(var i=0; i<25+25*Math.random(); i++){
				$('<div>')
					.css({
						position: 'absolute',
						fontSize: `${2+8*Math.random()}em`,
						left: `${90*Math.random()}%`,
						top: `${90*Math.random()}%`,
						transform: `rotate(${-45+90*Math.random()}deg)`,
						opacity: 0,
						animation: `rsa-feb14 ${25+35*Math.random()}s ${30*Math.random()}s infinite`,
						'animation-play-state': 'paused',
					})
					.html('<svg width="1em" xmlns="http://www.w3.org/2000/svg" viewBox="10 155 270 270" fill="red"><path d="M276.75 231.4688 Q276.75 259.7344 253.8281 291.5156 Q202.7812 362.3906 87.75 417.2344 Q90.2812 404.0156 90.2812 391.0781 Q90.2812 369 80.8594 350.2969 Q73.2656 335.3906 55.9688 316.5469 Q34.3125 293.0625 25.1719 278.0156 Q11.25 254.9531 11.25 231.4688 Q11.25 198.8438 28.5469 178.5938 Q46.9688 157.2188 79.0312 157.2188 Q100.4062 157.2188 118.6875 167.625 Q138.9375 179.2969 144.2812 198.5625 Q165.2344 157.2188 208.9688 157.2188 Q241.0312 157.2188 259.4531 178.5938 Q276.75 198.8438 276.75 231.4688 Z"/></svg>')
					.appendTo(this.background);
			}
		});

		$('.block:not(:has([data-rsa=html])), li.section').css({transition: 'background 1s'});

		$('.block:not(:has([data-rsa=html]))').css({background: 'rgba(255, 255, 255, .75)'});
		$('li.section:not(.current)').css({background: 'rgba(255, 255, 255, .25)'});
		$('li.section.current').css({background: 'rgba(217, 237, 247, .5)'});
		this.background.css({opacity: 1})
			.children().css('animation-play-state', 'running');

		rsa.log(`${this.name} is running`);
	},

	stop(){
		$('.block:not(:has([data-rsa=html])), li.section').css('background', '');
		this.background.css({opacity: 0})
			.children().css('animation-play-state', 'paused');

		rsa.log(`${this.name} stopped`);
	}
});
