/* (C) Sergey Roganov aka belomir, 2019 */

var apr12 = new rsa.Holyday({

	name: 'apr12',

	check(date){
		return date.getMonth()+1==4 && date.getDate()==12;
	},

	run(){
		this.init = this.init || $(()=>{
			$('body').css({position: 'relative'});

			this.W = $('body').width();
			this.H = $('body').height();

			var self = this;
			this.Spaceship = function(id, width, src){
				this.width = width;
				this.time = Math.floor(30+Math.random()*10);
				this.a = Math.random()*360;
				this.x = Math.random()*self.W;
				this.y = Math.random()*self.H;
				this.dom = $('<img>')
					.attr('id', id)
					.attr('width', `${width}px`)
					.attr('src', src)
					.css({
						position: 'absolute',
						transform: `translate(${this.x}px, ${this.y}px) rotate(${this.a}deg)`,
						transition: `all ${this.time}s linear`
					})
					.appendTo(Math.random()>.5?self.background:self.foreground);

				this.move = function(){
					this.a = Math.random()*360;
					this.x = Math.random()>.5?self.W:-this.width;
					this.y += (-.5+Math.random())*2*self.W;
					this.dom.css({transform: `translate(${this.x}px, ${this.y}px) rotate(${this.a}deg)`});
				}
			}

			this.background = $('<div>')
				.attr('data-rsa', this.name)
				.css({
					// background: `url('${rsa.link('')}')`,
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					pointerEvents: 'none',
					overflow: 'hidden',
					zIndex: -100,
					opacity: 0,
					transition: 'opacity 1s'
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
					pointerEvents: 'none',
					overflow: 'hidden',
					zIndex: +100,
					opacity: 0,
					transition: 'opacity 1s'
				})
				.appendTo('body');

			this.canvas = $('<canvas>')
				.attr('data-rsa', this.name)
				.css({
					position: 'fixed',
					zIndex: -150,
					width: '100vw',
					height: '100vh',
					opacity: 0,
					transition: 'opacity 1s'
				})
				.prependTo('body');

			this.ships = [];

			this.intervals = [];

			/* common background */
			this.canvas.attr({
				'width': this.canvas.width(),
				'height': this.canvas.height()
			});
			var ctx = this.canvas[0].getContext('2d');
			var cw = ctx.canvas.width;
			var ch = ctx.canvas.height;
			ctx.fillStyle = '#333';
			ctx.fillRect(0, 0, cw, ch);
			for(var i=0; i<750; i++){
				var c = 150+Math.floor(100*Math.random());
				var r = c+Math.floor((-.5+Math.random())*85);
				var g = c+Math.floor((-.5+Math.random())*85);
				var b = c+Math.floor((-.5+Math.random())*85);
				ctx.beginPath();
				ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
				ctx.arc(Math.random()*cw, Math.random()*ch, .5+Math.random()*2, 0, Math.PI*2);
				ctx.fill();
				ctx.closePath();
			}

			this.ships.push(new this.Spaceship('rsa_12april_sputnik',  '85',  rsa.link('apr12_sputnik.gif')));
			this.ships.push(new this.Spaceship('rsa_12april_vostok',   '100', rsa.link('apr12_vostok.png')));
			this.ships.push(new this.Spaceship('rsa_12april_soyuz',    '100', rsa.link('apr12_soyuz.png')));
			this.ships.push(new this.Spaceship('rsa_12april_progress', '100', rsa.link('apr12_progress.png')));
			this.ships.push(new this.Spaceship('rsa_12april_buran',    '120', rsa.link('apr12_buran.png')));
		});

		$('.block:not(:has([data-rsa=html])), li.section').css({transition: 'background 1s'});

		$('.block:not(:has([data-rsa=html]))').css({background: 'rgba(255, 255, 255, .75)'});
		$('li.section:not(.current)').css({background: 'rgba(255, 255, 255, .75)'});
		$('li.section.current').css({background: 'rgba(217, 237, 247, .75)'});

		this.background.css({opacity: 1});
		this.foreground.css({opacity: 1});
		this.canvas.css({opacity: 1});
		this.ships.forEach((e, i, a)=>{
			setTimeout(()=>{e.move();}, 100);
		});
		this.ships.forEach((e,i,a)=>{
			this.intervals.push(setInterval(()=>{
				e.move();
			}, e.time*1000+500));
		});

		rsa.log(`${this.name} is running`);
	},

	stop(){
		$('.block:not(:has([data-rsa=html])), li.section').css({background: ''});

		this.background.css({opacity: 0});
		this.foreground.css({opacity: 0});
		this.canvas.css({opacity: 0});
		this.intervals.forEach((e,i,a)=>{
			clearInterval(e);
		});
		this.intervals = [];

		rsa.log(`${this.name} stopped`);
	}
});
