/// <reference path="jquery.customSelect.min.js">
var viewModel = function( partition, volition, member) {
    var self = this;
    this.partition = partition;
    this.GuestId = volition.GuestId;
    this.notEmpty = partition != null && volition != null && member != null;
    this.selecting = ko.observableArray([]);
    var len = volition.Selected.length;
    $.each(partition.sections, function (i,v) {
        self.selecting.push({ sec: v, sel: ko.observable(i < len ? volition.Selected[i] : ""), opt: partition.options });
    });
    this.termDateTime = function (term) {
        var dt = new Date(term);
        return dt.getFullYear() + "年" + (dt.getMonth() + 1) + "月" + dt.getDate() + "日 " + dt.toLocaleTimeString();;
    };
    this.updateSelected = function (o, e) {
		$.ajax ({
		    url: 'api/Volitions/' + self.partition.Id + '/' + self.GuestId,
			type: 'PUT',
			scriptCharset:'utf-8',
			data: { Selected: $.map( self.selecting(), function(v,i){ return v.sel()}) },
			dataType: 'json'
		}).done( function( json) {
		}).fail( function() {
		});
	}.bind(this);
	this.test = function () {
	}.bind(this);
};
function initialize( pId, gId) {
	var partition;
	var volition;
	$.ajax ({
	    url: 'api/Partitions/' + pId,
		type: 'GET',
		scriptCharset:'utf-8',
		dataType: 'json'
	}).done( function( json) {
	    partition = json;
	    $.ajax ({
	        url: 'api/Volitions/' + pId + '/' + gId,
	        type: 'GET',
	        scriptCharset:'utf-8',
	        dataType: 'json'
	    }).done( function( json) {
	        volition = json;
	        $.getJSON("js/Members.js", function (json) {
	            var member = $.map(json, function(v,i) { if (v.Id == gId) return v });
	            ko.applyBindings(new viewModel(partition[0], volition[0], member[0]));
	        });
	    }).fail(function () {
	    });
	}).fail( function() {
	});
}