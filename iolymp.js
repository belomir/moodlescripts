/* (C) Sergey Roganov aka belomir, 2019 */

var iolymp = new rsa.Holyday({

	name: 'iolymp',

	check(date){
		return (date.getMonth()+1==3&&date.getDate()>=14&&date.getDate()<=15)||(date.getMonth()+1==4&&date.getDate()==14);
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
				.css({background: `url(${rsa.link('iolymp.png')}) repeat scroll left top`})
				.prependTo('body');
		});

		$('.block:not(:has([data-rsa=html])), li.section').css({transition: 'background 1s'});

		$('.block:not(:has([data-rsa=html]))').css({background: 'rgba(255, 255, 255, .75)'});
		$('li.section:not(.current)').css({background: 'rgba(255, 255, 255, .5)'});
		$('li.section.current').css({background: 'rgba(217, 237, 247, .5)'});
		this.background.css({opacity: 1});

		console.log(`${this.name} is running`);
	},

	stop(){
		$('.block:not(:has([data-rsa=html])), li.section').css({background: ''});
		this.background.css({opacity: 0});

		console.log(`${this.name} stopped`);
	}
});//iolymp
