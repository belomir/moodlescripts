/* (C) Sergey Roganov aka belomir, 2019 */

var apr1 = new rsa.Holyday({

	name: 'apr1',

	check(date){
		return date.getMonth()+1==4 && date.getDate()==1;
	},

	run(){
		this.init = this.init || $(()=>{
			$('body').css({position: 'relative'});
			this.menuitem = $('<li>')
				.text('Остановить безобразие на странице')
				.click(ev=>{
					this.stop();
				})
				.hide()
				.appendTo($('ul#action-menu-0-menu'));
			this.icons = $('img.activityicon').css({transition: 'all .5s linear'});
			this.divs = $('div.activityinstance');
		});

		this.interval = setInterval(()=>{
			this.icons.each((i, e)=>{
				$(e).css({transform: `rotate(${-25+50*Math.random()}deg) translate(${-5+10*Math.random()}px, ${-5+10*Math.random()}px) scale(${.75+.5*Math.random()})`});
			});
		}, 125);
		
		this.divs.each((i, e)=>{
			$(e).css({transform: `rotate(${-3+6*Math.random()}deg)`});
		});

		this.menuitem.show();

		rsa.log(`${this.name} is running`);
	},

	stop(){
		clearInterval(this.interval);

		this.icons.each((i, e)=>{
			$(e).css({transform: 'none'});
		});
		
		this.divs.each((i, e)=>{
			$(e).css({transform: 'none'});
		});

		this.menuitem.hide();

		rsa.log(`${this.name} stopped`);
	}
});
