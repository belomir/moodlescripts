/* (C) Sergey Roganov aka belomir, 2019 */

var cw = new rsa.Holyday({

	name: 'cw',

	check(date){
		return (date.getMonth()+1==3 && date.getDate()>=11 && date.getDate()<=15)
			|| (date.getMonth()+1==4 && date.getDate()>=15 && date.getDate()<=19)
			|| (date.getMonth()+1==5 && date.getDate()>=20 && date.getDate()<=24);
	},

	run(){
		this.init = this.init || (()=>{
			$('body').css({position: 'relative'});

			this.svg = $(`<svg data-rsa=controlWeek width="250px" height="250px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<style><![CDATA[
			text {
				animation: roll linear 20s infinite;
			}
			@keyframes roll {
				0%  {transform: rotate(360deg);}
				100%{transform: rotate(  0deg);}
			}
	]]></style>
	<defs>
		<linearGradient id="rsa-gradient">
			<stop stop-color="maroon" offset="0%" />
			<stop stop-color="red" offset="25%" />
			<stop stop-color="orange" offset="50%" />
			<stop stop-color="lime" offset="75%" />
			<stop stop-color="green" offset="100%" />
		</linearGradient>
	</defs>
	<path id="rsa-path" fill="none" stroke="none" d="M0,-125 a125,125 0 0,1 125,125" />
	<g style="transform: translate(250px, 250px);">
		<text style="font-family: cursive; font-style: italic; font-size: 20px;" dx="0">
			<textPath href="#rsa-path" fill="url(#rsa-gradient)">контрольная неделя</textPath>
		</text>
	</g>
</svg>`)
				.attr('data-rsa', this.name)
				.css({
					position: 'fixed',
					right: 0,
					bottom: 0,
					pointerEvents: 'none',
					opacity: 0,
					transition: 'opacity 1s',
				})
				.appendTo('body');
			return true;
		})();

		setTimeout(()=>{
			this.svg.css({opacity: .75});
		}, 1);

		rsa.log(`${this.name} is running`);
	},

	stop(){
		this.svg.css({opacity: 0});

		rsa.log(`${this.name} stopped`);
	}
});
