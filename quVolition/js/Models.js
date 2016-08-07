var viewModel = function( partitions, members) {
	var self = this;
	this.partitions = ko.mapping.fromJS( partitions);
	this.members = ko.mapping.fromJS( members);
	this.partitionId = ko.observable( partitions[0].Id || 0);
	this.onPartition = function( o,e) {
		self.partitionId( o.Id());
	}.bind(this);
	this.onVilition = function( o,e) {
		var obj = o;
	}.bind(this);
	this.Idx = function() {
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
	this.onChange = function( e) {	// event fired with jQuery
		var tr =  $(e.target).parents('tr')[0];
		var guestid = $(tr).data('guestid');
		var volitition = [];
		$(tr).find('select').each( function() {
			volitition.push( $(this).val());
		});
		return volitition;
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
