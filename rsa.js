/* (C) Sergey Roganov aka belomir, 2019 */

(Htmlblock=>{

	$(()=>{

		window.rsa = window.rsa || {};

		$.extend(rsa, {

			htmlblock: Htmlblock,
			prefix: 'http://moodle3.stu.ru/pluginfile.php/1/blog/post/516',


			log(message){
				this.logMessage = this.logMessage || '';
				if(message)this.logMessage+=message+'\n';
				else console.log(this.logMessage);
			},


			link(name){
				return `${this.prefix}/${name}`;
			},


			init(){
				this.date = new Date();
				this.comment = `(C) Sergey Roganov aka belomir, ${this.date.getFullYear()}`;
				this.courseId = window.location.href.match(/course\/view\.php\?id=([0-9]+)/)
				this.courseId = this.courseId?(this.courseId.length>1?this.courseId[1]:null):null;
				this.userId = $('#action-menu-0-menu li').eq(2).find('a').attr('href').match(/user\/profile.*id=([0-9]+)/);
				this.userId = this.userId?(this.userId.length>1?this.userId[1]:''):'';
				this.userId = parseInt(this.userId);
				this.userIsMaster = (this.userId==21874);
			},


			html(){
				$(this.htmlblock)
					.attr('data-rsa', 'html')
					.html(`<!-- ${this.comment} -->`)
					.css({overflow: 'visible'})
					.parents('[data-block=html]').eq(0) // fancy 'stycky' background
						.css({background: `url(${this.link('rsa_background.png')}) repeat fixed left top, linear-gradient(0, rgba(255,255,255,.75), rgba(255,255,255,.75))`});
				$('<div>').load(this.link('schedule.html')).appendTo(this.htmlblock);
				$(this.htmlblock).append($('<div>').load(this.link('programming.html')));
			},


			css(style){
				this.style = this.style || '';
				this.style += (style || '');
			},


			holydays(list){
				var self = this;

				this.Holyday = function(options){
					if(typeof(options)=='object'){
						for(var option in options){
							this[option] = options[option];
						}
					}
					self[this.name] = this;
				}

				this.Holyday.prototype = {
					name: '',
					check(){return false;},
					run(){},
					stop(){},
					exec(){
						if(this.check(self.date))this.run();
					}
				};

				$.each(list, (i, e)=>{
					$.getScript(this.link(`${e}.js`))
						.done((script, status)=>{
							this[e].exec();
							this.log(`${e} loaded`);
						})
						.fail((jqxhr, settings, exception)=>{
							this.log(`${e} not loaded:`);
							this.log(exception);
						});
				});
			},

			finit(){
				this.css(`
/* ${this.comment} */
	[data-rsa='link'] {
		text-decoration: none;
		border-bottom: 1px solid transparent;
		border-color: transparent;
		fill: black;
		transition: all 1s;
	}

	[data-rsa='link']:hover {
		color: blue !important;
		transition: all .1s;
		text-decoration: none;
		fill: blue;
		border-color: blue;
	}

	[data-rsa='link'] figcaption {
		border-bottom: 1px solid transparent;
		border-color: tansparent;
		transition: all 1s;
	}

	[data-rsa='link']:hover figcaption {
		border-color: blue;
		transition: all .1s;
	}
				`);
				$('head').append($('<style>').attr('data-rsa-style', 'html').html(this.style));
				$('ul.weeks h3.sectionname').css({'white-space': 'normal'});
			},

			exec(){
				this.init();
				this.html();
				this.holydays(['iolymp', 'feb14', 'feb23', 'mar8', 'apr1', 'apr12', 'ny', 'cw']);
				this.finit();
			}
		});

		rsa.exec();
	});
})(document.currentScript.parentNode);
