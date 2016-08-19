/// <reference path="jquery.customSelect.min.js">

var viewModel = function( partitions, members) {
	var self = this;
	this.partitions = ko.mapping.fromJS( partitions);
	this.members = ko.mapping.fromJS( members);
	this.partitionId = ko.observable( partitions[0].Id || 0);
	this.partitionBy = ko.observable(3);
	this.onPartition = function (o, e) {
		self.partitionId(o.Id());
	}.bind(this);
	this.listPartitions = ko.computed( function() {
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
	this.addPartition = function (o, e) {
		var pData = self.partitions()[self.Idx()];
		var pUrl = 'api/Partitions/';
		var pType;
		if ( self.partitionId() == 0) {
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
	this.delPartition = function (o, e) {
	}.bind(this);
	this.addSection = function (o, e) {
		self.partitions()[self.Idx()].sections.push("");
	}.bind(this);
	this.delSection = function (o, e) {
	    var idx = $(e.target).data('section');
		self.partitions()[self.Idx()].sections.splice(idx, 1) ;
	}.bind(this);
	this.Idx = function () {
		for ( var i = 0; i < self.partitions().length; i++) {
			if ( self.partitions()[i].Id() === self.partitionId()) return i;
		}
		return -1;	//no data
	};
	this.volHead = ko.computed( function() {
		var cols = ["Name"];
		$.each( self.partitions()[self.Idx()].sections(), function( i, v) {
			cols.push( v);
		});
		return cols;
	});
	this.volitions = ko.computed( function() {
		var cols = {};	// 連想配列を作成（ただし中身は後から入れておく）
		$.ajax ({
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
			$.each( self.partitions()[self.Idx()].options(), function( i, v) {
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
		return cols;
	});
	this.nameMembers = function( guestId) {
		for ( var i = 0; i < self.members().length; i++) {
			if ( self.members()[i].Id() === guestId) return self.members()[i].name();
		}
		return "";	//no data
	};
	this.guested = ko.computed(function () {
	    return self.partitions()[self.Idx()].guests();
	})
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
	this.test = function( o,e) {
		return ;
	}.bind(this);
};
function initialize() {
	var partitions;
	var members;
	$.ajax ({
		url: 'api/Partitions',
		type: 'GET',
		scriptCharset:'utf-8',
		dataType: 'json'
	}).done( function( json) {
		partitions = json;
		$.getJSON("js/Members.js", function( json){
		members = json;
			ko.applyBindings( new viewModel( partitions, members));
		});
	}).fail( function() {
	});
}
