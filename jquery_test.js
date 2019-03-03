/* RSA 2019 */

(Container=>{
	window.rsa = window.rsa || {};

	$.extend(rsa, {
		container: $(Container),

		works: [],
		busy(){
			var work = {};
			this.works.push(work);
			$('[id=busy]').css({display: 'flex'});
			return work;
		},
		unbusy(work){
			var i = this.works.indexOf(work);
			if(i>-1)this.works.splice(i, 1);
			if(this.works.length==0)$('[id=busy]').hide();
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
<h3>Преподаватель <a id=teacher></a></h3>
<p>Курс:</p>
<select id=course>
	<option value=0 disabled selected>выберите курс</option>
</select>
<p>Оценка:</p>
<select id=item disabled>
	<option value=0 disabled selected>выберите оценку</option>
</select>
<p>Группа:</p>
<select id=group disabled>
	<option value=0 disabled selected>выберите группу</option>
</select>
<button id=groupGrades disabled>Получить оценки группы</button>
<p>Студент:</p>
<select id=student disabled>
	<option value=0 disabled selected>выберите студента</option>
</select>
<button id=studentGrades disabled>Получить оценки студента</button>

<div id=busy style='
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
	<div id=spinner style='
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
				.html(`
	/* rsa spinner */
	@keyframes rsa-spinner-rotate {
		from {transform: rotate(0deg);}
		to {transform: rotate(360deg);}
	}`)
				.appendTo($('head'));
			
			var userId = $('#action-menu-0-menu li').eq(2).find('a').prop('href').match(/user\/profile.*id=(\d+)/);
			this.userId = userId?(userId.length>1?parseInt(userId[1]):0):0;
			this.userName = $('#action-menu-0-menubar').text();
			this.userUrl = `${this.origin}/user/profile.php`;
			
			$('#teacher').text(this.userName).prop({href: `${this.userUrl}?id=${this.userId}`});

			$('#groupGrades').click(ev=>{this.getGroupGrades(ev);});
			$('#studentGrades').click(ev=>{this.getStudentGrades(ev);});
		},


		getStudentGrades(evt){
			var work = this.busy();
			$.get(
				`${this.origin}/grade/report/history/index.php`,
				{
					id: this.courseId,
					itemid: this.itemId,
					userids: this.studentId,
					revisedonly: 1,
					download: 'csv',
				},
				data=>{
					console.log(data);
					this.unbusy(work);
				},
				'text');
		},


		getGroupGrades(evt){
			var work = this.busy();
			$.get(
				`${this.origin}/grade/report/history/index.php`,
				{
					id: this.courseId,
					itemid: this.itemId,
					revisedonly: 1,
					download: 'csv',
				},
				data=>{
					console.log(data);
					this.unbusy(work);
				},
				'text');
		},


		getStudents(evt){
			var work = this.busy();

			this.clearSelect('#student');
			this.studentId = 0;
			$('#studentGrades').prop({disabled: true});
			/* TODO: sort by surname */
			$.each(Object.keys(this.groups[this.groupId]), (i,e)=>{
				var studentId = e;
				var studentName = this.groups[this.groupId][e];
				$('<option>')
					.text(studentName)
					.val(studentId)
					.appendTo($('#student'));
				
				$('#student')
					.prop({disabled: false})
					.change(ev=>{
						this.studentId = $(ev.currentTarget).val();
						$('#studentGrades').prop({disabled: !this.itemId});
					});
				$('#groupGrades')
					.prop({disabled: false});
				this.unbusy(work);
			});
		},


		getGroups(evt){
			var work = this.busy();

			this.clearSelect('#group');
			this.clearSelect('#student');
			this.groupId = 0;
			this.studentId = 0;
			$('#groupGrades').prop({disabled: true});
			$('#studentGrades').prop({disabled: true});

			$.get(
				`${this.origin}/group/overview.php`,
				{id: $(evt.currentTarget).val()},
				data=>{
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
									var studentId = $(e).prop('href').match(/id=(\d+)/)[1];
									var studentName = $(e).text();
									this.groups[groupId][studentId] = studentName;
								});
							$('<option>')
								.text(groupName)
								.val(groupId)
								.appendTo($('#group'));
						});

						$('#group')
							.change(ev=>{
								this.groupId = $(ev.currentTarget).val();
								this.getStudents(ev);
								$('#groupGrades').prop({disabled: !this.itemId});
							})
							.prop({disabled: false});

						this.unbusy(work);
				},
				'html');
		},


		getItems(){
			var work = this.busy();

			this.clearSelect('#item');
			this.itemId = 0;
			$('#groupGrades').prop({disabled: true});
			$('#studentGrades').prop({disabled: true});

			$.get(`${this.origin}/grade/report/singleview/index.php`, {id: this.courseId}, data=>{
				$(data)
					.find('form:has(input[name=item][value=grade]) select[name=itemid] > option')
					.each((i,e)=>{
						var itemId = $(e).val();
						var itemName = $(e).text();
						$('<option>')
							.val(itemId)
							.text(itemName)
							.appendTo($('#item'));
					});
				$('#item')
					.prop({disabled: false})
					.change(ev=>{
						this.itemId = $(ev.currentTarget).val();
						$('#groupGrades').prop({disabled: !this.groupId});
						$('#studentGrades').prop({disabled: !this.studentId});
					});
				this.unbusy(work);
			}, 'html');
		},


		getCourses(){
			var work = this.busy();

			$.get(this.userUrl, {id: this.userId}, data=>{

				$(data)
					.find('a[href*="/user/view.php"][href*="id=21874"][href*=course]:not(.dimmed)')
					.each((i,e)=>{
						var href = $(e).prop('href');
						var courseId = href.match(/course=(\d+)/);
						courseId = courseId?(courseId.length>1?parseInt(courseId[1]):0):0;
						/* TODO: check for teacher role by course profile link */
						$('<option>')
							.text($(e).text())
							.val(courseId)
							.appendTo($('#course'));
					});

				$('#course').change(ev=>{
					this.courseId = $(ev.currentTarget).val();
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
	* sort groups by name
	* sort students by surname
	* check for teacher role in courses
	* draw plot by csv
*/