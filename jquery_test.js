/* RSA 2019 */

(Container=>{
		window.rsa = window.rsa || {};
		$.extend(rsa, {
			container: $(Container),
			url: 'http://moodle3.stu.ru/user/view.php?id=21874',
			busy(){this.busyDiv.css({display: 'flex'});},
			unbusy(){this.busyDiv.hide();},
		});
		
		rsa.container.css({position: 'relative', minHeight: '10em'});

		$(`<h3>Преподаватель <a data-rsa=userId></a></h3>
<p>Курс:</p>
<select data-rsa=course>
	<option value=0 disabled selected>выберите курс</option>
</select>
<p>Оценка:</p>
<select data-rsa=grade disabled>
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
</div>`).appendTo(rsa.container);

		rsa.busyDiv = $('[data-rsa=busy]');

		rsa.busy();

		$('<style>')
			.attr('data-rsa', 'rsa-style')
			.html(`	/* rsa spinner */
	@keyframes rsa-spinner-rotate {
		from {transform: rotate(0deg);}
		to {transform: rotate(360deg);}
	}`)
			.appendTo($('head'));

		var origin = window.location.origin;
		
		var userId = $('#action-menu-0-menu li').eq(2).find('a').attr('href').match(/user\/profile.*id=([0-9]+)/);
		userId = userId?(userId.length>1?parseInt(userId[1]):0):0;
		
		var userName = $('#action-menu-0-menubar').text();
		
		var url = `${origin}/user/profile.php`;
		
		$('[data-rsa=userId]').text(userName).attr({href: `${url}?id=${userId}`});
		
		rsa.busy();
		$.get(url, {id: userId}, data=>{
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
				rsa.busy();
				rsa.courseId = $(ev.currentTarget).val();
				$('[data-rsa=group]').prop({disabled: true});
				$.get('http://moodle3.stu.ru/group/overview.php', {id: $(ev.currentTarget).val()}, data=>{
					$('[data-rsa=group]').val(0);
					$('[data-rsa=group]>option:not(:first)').prop({selected: false});
					$('[data-rsa=group]>option:not(:first)').remove();
					$('[data-rsa=group]>option:first').prop({selected: true});
					rsa.groups = {};
					$(data)
						.find('select[name=group]>option')
						.filter((i,e)=>$(e).val()>0)
						.each((i,e)=>{
							var groupId = $(e).val();
							var groupName = $(e).text();
							rsa.groups[groupId] = {};
							$(data)
								.find('table tr')
								.filter((i,e)=>$(e).find('td:first').text()==groupName)
								.find('td:eq(1)>a')
								.each((i,e)=>{
									var studentId = $(e).attr('href').match(/id=(\d+)/)[1];
									var studentName = $(e).text();
									rsa.groups[groupId][studentId] = studentName;
								});
							$('<option>')
								.text(groupName)
								.val(groupId)
								.appendTo($('[data-rsa=group]'));
						});
					$('[data-rsa=group]').change(ev=>{
						rsa.busy();
						$('[data-rsa=student]').prop({disabled: true});
						$('[data-rsa=student]').val(0);
						$('[data-rsa=student]>option:not(:first)').prop({selected: false});
						$('[data-rsa=student]>option:not(:first)').remove();
						$('[data-rsa=student]>option:first').prop({selected: true});
						rsa.groupId = $(ev.currentTarget).val();
						/* TODO: sort by surname */
						$.each(Object.keys(rsa.groups[rsa.groupId]), (i,e)=>{
							var studentId = e;
							var studentName = rsa.groups[rsa.groupId][e];
							$('<option>')
								.text(studentName)
								.val(studentId)
								.appendTo($('[data-rsa=student]'));
							$('[data-rsa=student]').prop({disabled: false});
							rsa.unbusy();
						});
					});
					$('[data-rsa=group]').prop({disabled: false});
					console.log(rsa.groups);
					rsa.unbusy();
				}, 'html');
			});
			rsa.unbusy();
		}, 'html');
	})(document.currentScript.parentNode);

/* 
TODO:
	itemids: http://moodle3.stu.ru/grade/report/singleview/index.php?id=4513
	csvdata: http://moodle3.stu.ru/grade/report/history/index.php?id=4513&userids=21874&itemid=30613&revisedonly=1&download=csv
*/