/// <reference path="jquery.customSelect.min.js">
var fromAddress = "master@foo.jp";
var viewModel = function (partitions, members, groups) {
    var self = this;
    var mapping = {
        'sections': { create: function (options) { return ko.observable(options.data); } },
        'options': { create: function (options) { return ko.observable(options.data); } }
    }
    this.partitions = ko.mapping.fromJS(partitions, mapping);
    this.members = ko.mapping.fromJS(members);
    this.groups = groups;
	this.partitionId = ko.observable( 0 < partitions.length ? partitions[0].Id : -1);	// partitionId:-1 は空フラグ
	this.partitionBy = ko.observable(3);
	this.groupId = ko.observable(-1);
	this.Idx = function () {
	    var id = self.partitionId();
	    if (id == -1) id = 0;       // もし partitions が空でなく、現 partitionId が-1なら今、追加したところのはず！（遅延処理の代用）
	    for (var i = 0; i < self.partitions().length; i++) {
	        if (self.partitions()[i].Id() === id) return i;
	    }
	    return -1;	//no data
	};
	this.notEmpty = ko.computed(function () {
	    return 0 < self.partitions().length;
	});
	this.onPartition = function (o, e) {
		self.partitionId(o.Id());
	}.bind(this);
	this.listPartitions = ko.pureComputed(function () {
		return self.partitions.sort( function (left,right) {
			return left.term()==right.term()?0:(left.term()<right.term()?-1:1);
		}).slice( 0, self.partitionBy()+1);
	});
	this.morePartitions = function (o, e) {
		self.partitionBy(self.partitionBy() + 2);
	}.bind(this);
	this.newPartition = function (o, e) {
		var pTerm = new Date();
		pTerm.setDate(pTerm.getDate() + 14);
		self.partitions.push(ko.mapping.fromJS({ "Id": 0, "name": "", "description": "", "sections": [], "guests": [], "options": [], "term": pTerm.toISOString() }));
		self.partitionId(0);
	}.bind(this);
	this.updatePartition = function (o, e) {
		var pData = self.partitions()[self.Idx()];
		var pUrl = 'api/Partitions/';
		var pType;
		if ( self.partitionId() === 0) {
			pType =  'POST';
		} else {
			pType =  'PUT';
			pUrl += self.partitionId();
		}
		$.ajax ({
			url: pUrl,
			type: pType,
			scriptCharset:'utf-8',
			data : {name:pData.name(), description:pData.description(), options:pData.options(), sections:pData.sections(), guests:pData.guests(), term:pData.term()},
			dataType: 'json'
		}).done( function( json) {
			alert('登録完了');
		}).fail( function() {
			alert('登録失敗');
		});
	}.bind(this);
	this.removePartition = function (o, e) {
		if (self.partitionId() === 0 || confirm("データを完全に消去しますか？") == true) {
			self.partitions.splice(self.Idx(), 1); // しかる後、削除
			self.partitionId(self.partitions()[0].Id);            // 先に移動しておく
		}
	}.bind(this);
	this.invitePartition = function (o, e) {
	    var gIds = self.guested();
/*      var gInv = $.map( self.members(), function (v,i) {
	        if (0 < $.inArray(v.Id(), gIds)) return ko.mapping.toJS(v);
	    });
	    $.each( gInv, function (i,v) {
	        putMail(self.partitionId(), v.Id, v.name, v.mail);
	    });
*/	    var param = $.map(self.members(), function (v,i) {
	        if (0 < $.inArray(v.Id(), gIds)) return { GuestId: v.Id(), name: v.name(), addr: v.mail()};
	    });
	    postMail(self.partitionId(), fromAddress, param);

	}.bind(this);
	this.addSection = function (o, e) {
	    self.partitions()[self.Idx()].sections.push(ko.observable(""));
	}.bind(this);
	this.delSection = function (o, e) {
	    var idx = $(e.target).data('section');
	    var sec = self.partitions()[self.Idx()].sections;
	    if (sec()[idx]() == "") {
	        sec.splice(idx, 1);
	    } else {
	        alert("空でない要素は削除できません");
	    }
	}.bind(this);
	this.addOption = function (o, e) {
	    self.partitions()[self.Idx()].options.push(ko.observable(""));
	}.bind(this);
	this.delOption = function (o, e) {
	    var idx = $(e.target).data('option');
	    var opt = self.partitions()[self.Idx()].options;
	    if (opt()[idx]() == "") {
	        opt.splice(idx, 1);
	    } else {
	        alert("空でない要素は削除できません");
	    }
	}.bind(this);
	this.volHead = ko.pureComputed(function () {
		var cols = ["Name"];
		if ( self.notEmpty()) {
		    $.each(self.partitions()[self.Idx()].sections(), function (i, v) {
				cols.push(v);
			});
		}
		return cols;
	});
	this.volitions = ko.computed(function () {
		var cols = {};	// 連想配列を作成（ただし中身は後から入れておく）
		if ( self.notEmpty()) {
		    $.ajax({
				url: 'api/Volitions/'+self.partitionId(),
				type: 'GET',
				scriptCharset:'utf-8',
				dataType: 'json'
			}).done( function( json) {
				$.each( json, function( i, v) {
					v.Selected.unshift(self.nameMembers(v.GuestId));
					cols[v.GuestId] = v.Selected;
				});
	// knockoutでどうしても実装できなかったのでjQueryに逃げた
				var $select = $('<select>').addClass('customSelect');
				$.each( $.map( self.partitions()[self.Idx()].options(), function(n) { return n();}), function( i, v) {
					$select.append('<option>'+v);	//).html(v).val(v);
				});
				$('#Volititions tr').empty().each(function() {
					$elm = $(this);
					$.each( cols[$(this).data("guestid")],function(i,v) {
						if ( i === 0)	$elm.append('<td>'+v);
						else			$elm.append($('<td>').append($select.clone().val(v).on('change', self.onChange)));
					});
				});
				$(".customSelect").customSelect();
			}).fail(function() {
			});
		}
		return cols;
	});
	this.nameMembers = function( guestId) {
		for ( var i = 0; i < self.members().length; i++) {
			if ( self.members()[i].Id() === guestId) return self.members()[i].name();
		}
		return "";	//no data
	};
	this.guested = ko.pureComputed( function() {
	    if (self.notEmpty()) {
	        return self.partitions()[self.Idx()].guests();
	    } else return;
	});
	this.onChange = function( e) {	// event fired with jQuery
		var tr =  $(e.target).parents('tr')[0];
		var guestid = $(tr).data('guestid');
		var volitition = [];
		$(tr).find('select').each( function() {
			volitition.push( $(this).val());
		});
		for ( var i = 0; i < volitition.length; i++) {
			if ( volitition[i] == null) return;	// 一つでも未入力があれば登録しない
		}
		$.ajax ({
			url: 'api/Volitions/'+self.partitionId()+'/'+guestid,
			type: 'PUT',
			scriptCharset:'utf-8',
			data : {Selected:volitition},
			dataType: 'json'
		}).done( function( json) {
		}).fail( function() {
		});
	}.bind(this);
	this.showGroup = function (o,e) {
	    var group = $(e.target).data('group');
	    if (self.groupId() == group) group = -1;
	    self.groupId(group);
	};
	this.getMembers = function ( group) {
	    return ko.utils.arrayFilter(this.members(), function (v, i) {
            return 0 <= $.inArray(+group, v.group());
	    });
	}.bind(this);
	this.checkUp = function (o, e) {    // o.Id is selected group.
	    var self = this;
	    if (self.notEmpty()) {          // any member belong to selected group, set into guests of current partition.
	        self.partitions()[self.Idx()].guests(ko.utils.arrayMap(ko.utils.arrayFilter(self.members(), function (v, i) { return 0 <= $.inArray(+o.Id, v.group())}), function (v, i) { return v.Id() }));
	    }
	}.bind(this);
};
function initialize( members, groups) {
	var partitions;
	var members;
	$('.Is-loading').toggle();
	$.ajax({
		url: 'api/Partitions',
		type: 'GET',
		scriptCharset:'utf-8',
		dataType: 'json'
	}).done( function( partitions) {
	    ko.applyBindings( new viewModel( partitions, members, groups));
	}).fail( function() {
	}).complete(function () { $('.Is-loading').toggle() });
}
function postMail(pId, fAddr, param) {
    $.ajax({
        url: 'api/Members/',
        type: 'post',
        scriptCharset: 'utf-8',
        data: { PartitionId: pId, fromAddr: fAddr, toList: param },
        dataType: 'json'
    }).done(function (json) {
        alert('登録完了');
    }).fail(function () {
        alert('登録失敗');
    });
};
function putMail(pId, gId, name, mail) {
    $.ajax({
        url: 'api/Members/' + pId + '/' + gId,
        type: 'put',
        scriptCharset: 'utf-8',
        data: { toName: name, toAddr: mail, fromAddr: fromAddress, subject: '登録依頼', body: 'メール本文' },
        dataType: 'json'
    }).done(function (json) {
        alert('登録完了');
    }).fail(function () {
        alert('登録失敗');
    });
};