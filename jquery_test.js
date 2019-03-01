/* RSA 2019 */

(Container=>{
	window.rsa = window.rsa || {};

	$.extend(rsa, {
		container: $(Container),

		works: [],
		busy(){
			var work = {};
			this.works.push(work);
			$('[data-rsa=busy]').css({display: 'flex'});
			return work;
		},
		unbusy(work){
			var i = this.works.indexOf(work);
			if(i>-1)this.works.splice(i, 1);
			if(this.works.length==0)$('[data-rsa=busy]').hide();
		},


		clearSelect(selector){
			var g = $(selector)
				.prop({disabled: true})
				.val(0);
			g.find('option:not(:first)')
				.prop({selected: false})
				.remove();
			g.find('option:first')
				.prop({selected: true});
		},
		

		init(){
			this.origin = window.location.origin;

			$(`
<h3>Преподаватель <a data-rsa=userId></a></h3>
<p>Курс:</p>
<select data-rsa=course>
	<option value=0 disabled selected>выберите курс</option>
</select>
<p>Оценка:</p>
<select data-rsa=item disabled>
	<option value=0 disabled selected>выберите оценку</option>
</select>
<p>Группа:</p>
<select data-rsa=group disabled>
	<option value=0 disabled selected>выберите группу</option>
</select>
<p>Студент:</p>
<select data-rsa=student disabled>
	<option value=0 disabled selected>выберите студента</option>
</select>
<div data-rsa=busy style='
	position: absolute;
	left:0;
	top:0;
	right:0;
	bottom:0;
	opacity: .75;
	background: white;
	display: none;
	align-items: center;
	justify-content: center;
'>
	<div data-rsa=spinner style='
		width: 4em;
		height: 4em;
		border-radius: 50%;
		border: 1em solid rgba(0,0,0,.2);
		border-top: 1em solid rgba(0,0,0,.7);
		animation: rsa-spinner-rotate 2s linear infinite;
'>
	</div>
</div>`).appendTo(this.container);
			
			this.container.css({position: 'relative', minHeight: '10em'});
			
			$('<style>')
				.attr('data-rsa', 'rsa-style')
				.html(`
	/* rsa spinner */
	@keyframes rsa-spinner-rotate {
		from {transform: rotate(0deg);}
		to {transform: rotate(360deg);}
	}`)
				.appendTo($('head'));
			
			var userId = $('#action-menu-0-menu li').eq(2).find('a').attr('href').match(/user\/profile.*id=(\d+)/);
			this.userId = userId?(userId.length>1?parseInt(userId[1]):0):0;
			this.userName = $('#action-menu-0-menubar').text();
			this.userUrl = `${this.origin}/user/profile.php`;
			
			$('[data-rsa=userId]').text(this.userName).attr({href: `${this.userUrl}?id=${this.userId}`});
		},


		getStudents(evt){
			var work = this.busy();

			this.clearSelect('[data-rsa=student]');
			
			this.groupId = $(evt.currentTarget).val();
					/* TODO: sort by surname */
					$.each(Object.keys(this.groups[this.groupId]), (i,e)=>{
						var studentId = e;
						var studentName = this.groups[this.groupId][e];
						$('<option>')
							.text(studentName)
							.val(studentId)
							.appendTo($('[data-rsa=student]'));
						
						$('[data-rsa=student]')
							.prop({disabled: false});
						this.unbusy(work);
					});
		},


		getGroups(evt){
			var work = this.busy();

			this.courseId = $(evt.currentTarget).val();

			this.clearSelect('[data-rsa=group]');
			this.clearSelect('[data-rsa=student]');

			$.get(`${this.origin}/group/overview.php`, {id: $(evt.currentTarget).val()}, data=>{
				this.groups = {};

				$(data)
					.find('select[name=group]>option')
					.filter((i,e)=>$(e).val()>0)
					.each((i,e)=>{
						var groupId = $(e).val();
						var groupName = $(e).text();
						this.groups[groupId] = {};
						$(data)
							.find('table tr')
							.filter((i,e)=>$(e).find('td:first').text()==groupName)
							.find('td:eq(1)>a')
							.each((i,e)=>{
								var studentId = $(e).attr('href').match(/id=(\d+)/)[1];
								var studentName = $(e).text();
								this.groups[groupId][studentId] = studentName;
							});
						$('<option>')
							.text(groupName)
							.val(groupId)
							.appendTo($('[data-rsa=group]'));
					});

					$('[data-rsa=group]')
						.change(ev=>{this.getStudents(ev);})
						.prop({disabled: false});
					this.unbusy(work);
			}, 'html');
		},


		getItems(){
			var work = this.busy();

			this.clearSelect('[data-rsa=item]');

			$.get(`${this.origin}/grade/report/singleview/index.php`, {id: this.courseId}, data=>{
				$(data)
					.find('form:has(input[name=item][value=grade]) select[name=itemid] > option')
					.each((i,e)=>{
						var itemId = $(e).val();
						var itemName = $(e).text();
						$('<option>')
							.val(itemId)
							.text(itemName)
							.appendTo($('[data-rsa=item]'));
					});
				$('[data-rsa=item]').prop({disabled: false});
				this.unbusy(work);
			}, 'html');
		},


		getCourses(){
			var work = this.busy();

			$.get(this.userUrl, {id: this.userId}, data=>{

				$(data)
					.find('a[href*="/user/view.php"][href*="id=21874"][href*=course]:not(.dimmed)')
					.each((i,e)=>{
						var href = $(e).attr('href');
						var courseId = href.match(/course=(\d+)/);
						courseId = courseId?(courseId.length>1?parseInt(courseId[1]):0):0;
						/* TODO: check for teacher role by course profile link */
						$('<option>')
							.text($(e).text())
							.val(courseId)
							.appendTo($('[data-rsa=course]'));
					});

				$('[data-rsa=course]').change(ev=>{
					this.getGroups(ev);
					this.getItems(ev);
				});
				this.unbusy(work);
			}, 'html');
		},


		exec(){
			this.init();
			this.getCourses();
		},
	});

	rsa.exec();

})(document.currentScript.parentNode);

/* 
TODO:
	itemids: http://moodle3.stu.ru/grade/report/singleview/index.php?id=4513
	csvdata: http://moodle3.stu.ru/grade/report/history/index.php?id=4513&userids=21874&itemid=30613&revisedonly=1&download=csv
*/