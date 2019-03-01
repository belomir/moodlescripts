/* (C) Sergey Roganov aka belomir, 2019 */

var ny = new rsa.Holyday({

	name: 'ny',

	check(date){
		return (date.getMonth()+1==12 && date.getDate()>=23) || (date.getMonth()+1==1 && date.getDate()<=8);
	},

	run(){
		this.init = this.init || (()=>{
			$('body').css({position: 'relative'});

			this.n = (rsa.userId+rsa.date.getDate())%12+1;

			$('head').append($('<style>').attr('data-rsa', 'ny_html').html(`
	/* rsa new year (C) */
	[data-rsa=ny_foreground] {
		opacity: .9;
		position: fixed;
		cursor: pointer;
		transition: all 1s;
	}
	[data-rsa=ny_foreground]:hover {
		opacity: .4;
	}
			`));

			this.background = $('<div>')
				.attr('data-rsa', this.name)
				.css({
					background: `url('${rsa.link(`ny${this.n}.jpg`)}')`,
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					pointerEvents: 'none',
					overflow: 'hidden',
					zIndex: -100,
					opacity: 0,
					transition: 'opacity 1s',
				})
				.prependTo('body');

			this.foreground = ()=>{
				var img = '';
				var num = this.n;
				switch(num%12){
					case 0:
						img = 'ny_top.png';
						return $('<img>').attr('src', rsa.link(img)).css({top: 0, left: 0, maxWidth: '33%', maxHeight: '33%'});
						break;
					case 1:
						img = 'ny_bottom.png';
						return $('<img>').attr('src', rsa.link(img)).css({'bottom': 0, 'right': 0, 'max-width': '33%', 'max-height': '33%'});
						break;
					case 2:
						img = 'ny_hstripe1.png';
						return $('<div>').css({'left': 0, 'right': 0, 'height': '6em', 'background': `url('${rsa.link(img)}') repeat-x center/contain`, 'top': 0});
						break;
					case 3:
						img = 'ny_hstripe2.png';
						return $('<div>').css({'left': 0, 'right': 0, 'height': '6em', 'background': `url('${rsa.link(img)}') repeat-x center/contain`, 'bottom': 0});
						break;
					case 4:
						img = 'ny_topleft1.png';
						return $('<img>').attr('src', rsa.link(img)).css({'top': 0, 'left': 0, 'max-width': '33%', 'max-height': '33%'});
						break;
					case 5:
						img = 'ny_topright1.png';
						return $('<img>').attr('src', rsa.link(img)).css({'top': 0, 'right': 0, 'max-width': '33%', 'max-height': '33%'});
						break;
					case 6:
						img = 'ny_topleft2.png';
						return $('<img>').attr('src', rsa.link(img)).css({'top': 0, 'left': 0, 'max-width': '33%', 'max-height': '33%'});
						break;
					case 7:
						img = 'ny_topright2.png';
						return $('<img>').attr('src', rsa.link(img)).css({'top': 0, 'right': 0, 'max-width': '33%', 'max-height': '33%'});
						break;
					case 8:
						img = 'ny_top.png';
						return $('<img>').attr('src', rsa.link(img)).css({'top': 0, 'right': 0, 'max-width': '33%', 'max-height': '33%'});
						break;
					case 9:
						img = 'ny_bottom.png';
						return $('<img>').attr('src', rsa.link(img)).css({'bottom': 0, 'left': 0, 'max-width': '33%', 'max-height': '33%'});
						break;
					case 10:
						img = 'ny_hstripe1.png';
						return $('<div>').css({'left': 0, 'right': 0, 'height': '6em', 'background': `url('${rsa.link(img)}') repeat-x center/contain`, 'bottom': 0});
						break;
					case 11:
						img = 'ny_hstripe2.png';
						return $('<div>').css({'left': 0, 'right': 0, 'height': '6em', 'background': `url('${rsa.link(img)}') repeat-x center/contain`, 'top': 0});
						break;
				}
			};
			
			this.foreground = this.foreground()
				.attr({'data-rsa': 'ny_foreground', 'title': 'кликни меня, если мешает'})
				.click(ev=>{
					$(ev.currentTarget).css({opacity: .1, pointerEvents: 'none'});
					setTimeout(()=>{
						$(ev.currentTarget).css({opacity: .9, pointerEvents: 'auto'});
					}, 10000);
				})
				.css({
					zIndex: +100,
					opacity: 0,
					position: 'fixed',
					cursor: 'pointer',
					pointerEvents: 'none',
					transition: 'opacity 1s',
				})
				.appendTo('body');

			return true;
		})();

		$('.block:not(:has([data-rsa=html])), li.section').css({transition: 'background 1s'});


		setTimeout(()=>{//hack
			$('.block:not(:has([data-rsa=html]))').css({background: 'rgba(255, 255, 255, .75)'});
			$('li.section:not(.current)').css({background: 'rgba(255, 255, 255, .75)'});
			$('li.section.current').css({background: 'rgba(217, 237, 247, .85)'});
			this.background.css({opacity: 1});
			this.foreground.css({pointerEvents: 'auto', opacity: ''});
		}, 1);

		rsa.log(`${this.name} is running`);
	},

	stop(){
		$('.block:not(:has([data-rsa=html])), li.section').css({background: ''});

		this.background.css({opacity: 0});
		this.foreground.css({pointerEvents: 'none', opacity: 0});

		rsa.log(`${this.name} stopped`);
	}
});
