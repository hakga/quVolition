/// <reference path="jquery.customSelect.min.js">
var fromAddress = "master@foo.jp";
var viewModel = function (partitions, members, groups) {
    var self = this;
    this.partitions = ko.observableArray();
    this.setPartition = function (partition) {
        for (var i = 0; i < self.partitions().length; i++) {
            if (self.partitions()[i].Id == partition.Id) {
                if ( self.partitions()[i].guests ==null) self.partitions()[i].guests = partition.guests || [];
                if (self.partitions()[i].sections == null) self.partitions()[i].sections = partition.sections || [];
                if (self.partitions()[i].options == null) self.partitions()[i].options = partition.options || [];
                if (self.partitions()[i].description == null) self.partitions()[i].description = partition.description || "";
                return true;
            }
        }
        self.partitions.push(partition);
        return false;
    };
    ko.utils.arrayForEach(partitions, function (v) {
        self.setPartition(v);
    });

    this.members = ko.mapping.fromJS(members);
    this.groups = groups;
	this.partitionId = ko.observable( 0 < partitions.length ? partitions[0].Id : -1);	// partitionId:-1 は空フラグ
	this.partitionOn = ko.pureComputed(function () {

	});
	this.Idx = function () {
	    var id = self.partitionId();
	    if (id == -1) id = 0;       // もし partitions が空でなく、現 partitionId が-1なら今、追加したところのはず！（遅延処理の代用）
	    for (var i = 0; i < self.partitions().length; i++) {
	        if (self.partitions()[i].Id === id) return i;
	    }
	    return -1;	//no data
	};
	this.notEmpty = ko.computed(function () {
	    return 0 < self.partitions().length;
	});
	this.onPartition = function (o, e) {
		self.partitionId(o.Id);
	}.bind(this);
	this.nameMembers = function( guestId) {
		for ( var i = 0; i < self.members().length; i++) {
			if ( self.members()[i].Id() === guestId) return self.members()[i].name();
		}
		return "";	//no data
	};

	this.secHead = ko.pureComputed(function () {
	    var cols = ["Section"];
	    if (self.notEmpty()) {
	        $.each(self.partitions()[self.Idx()].sections, function (i, v) {
	            cols.push(v);
	        });
	    }
	    return cols;
	});
	this.computedOption = ko.observableArray(); // とりあえず空の配列。中身はselectedOptionに入れておいてもらう
	this.selectedOption = ko.computed(function () {
	    var pId = self.partitionId();
	    self.computedOption.removeAll();    // いったん中身消去
	    if (self.notEmpty()) {
	        $.ajax({
	            url: 'api/Volitions/' + pId,
	            type: 'GET',
	            scriptCharset: 'utf-8',
	            dataType: 'json'
	        }).done(function (json) {       // 受け取ったGuestIdごとのデータを
	            var dic = {};               // optionごとの連想配列に組み直す
	            var p = self.partitions()[self.Idx()];
	            var o = p.options.length;
	            var s = p.sections.length;
	            $.each(p.options, function (idx, val) { dic[val] = []; });
	            $.each(json, function (idx, val) {
	                for (var i = val.Selected.length; i < o; i++) val.Selected.push('-');
	                $.each(val.Selected, function (id, va) {
	                    if (dic[va] == null) dic[va] = [];
	                    if (dic[va][id] == null) dic[va][id] = [];
	                    dic[va][id].push(val.GuestId);
	                });
	            });
	            $.each(dic, function (idx, val) {
	                for (i = 0; i < s; i++) if (val[i] == undefined) val[i] = [];   // 誰も選択してないとき選択数0を表示をするための追加処理
	                val.unshift(idx);       // option名の表示
	                self.computedOption.push(ko.utils.arrayMap(val, function (v, i) {
	                    if (v) {
	                        if (Array.isArray(v)) return { disp: v.length, data: v };
	                        else return { disp: (v=='-'?'未選択':v), data: [] };  // option名の表示
	                    } else {
	                        return { disp: 0, data: [] };   // neither select this one.
	                    }
	                }));
	            });
	        }).fail(function () {
	        }).complete(function () {
	            $('#Options td.optCounter').on('click', function (e) {
	                var cell = $(this);
	                var guests = ko.utils.arrayMap($(this).data('guests').split(','), function (v, i) { return '<option>' + self.nameMembers(v) + '</option>' });
	                self.popup[0].innerHTML = '<ul>' + guests.join('') + '</ul>';
	                self.popup.dialog({ height: 38+18*guests.length });
	                self.popup.dialog("open");
	                window.setTimeout(function () { self.popup.dialog("close") }, 2000);
	            });
	        });
	    }
	})();   // 即時実行
	this.listupPartition = function () {
	    $.ajax({
	        url: 'api/Partitions',
	        type: 'DELETE',
	        scriptCharset: 'utf-8',
	        dataType: 'json'
	    }).done(function (partitions) {
	        ko.utils.arrayForEach(partitions, function (v) {
	            self.setPartition(v);
	        });
	    }).fail(function () {
	    }).complete(function () {
	    });
	}();   // 即時実行

	this.popup = $("#namePopup");
	this.popup.dialog({
	    width: 200,
	    autoOpen: false,
	    show: {
	        effect: "fade",
	        duration: 250
	    },
	    hide: {
	        effect: "fade",
	        duration: 250
	    }

	});
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
