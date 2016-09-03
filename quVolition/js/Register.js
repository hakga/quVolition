/// <reference path="jquery.customSelect.min.js">
var viewModel = function( partition, volition) {
    var self = this;
    this.model = 

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
	this.test = function () {
	    var g = 0 < self.guested.length;
	    return g;
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