const fromAddress = "master@foo.jp";
var viewModel = function (members, groups) {
    var self = this;
    this.sender = ko.observable(fromAddress);
    this.mailSubject = ko.observable("");
    this.mailBody = ko.observable("");
    this.members = ko.mapping.fromJS(members);
    this.groups = groups;
	this.groupId = ko.observable(-1);
	this.guests = ko.observableArray([]);
	this.invitePartition = function (o, e) {
	    var gIds = self.guested();
	    var param = $.map(self.members(), function (v,i) {
	        if (0 <= $.inArray(v.Id(), gIds)) return { GuestId: v.Id(), name: v.name(), addr: v.mail()};
	    });
	    var addr = $(e.target).val();
	    switch ( addr) {
	        case "to":
	            postMail( self.sender, param, self.mailSubject, self.mailBody);
	            break;
	        case "cc":
	        case "bcc":
	            putMail( self.sender, param, self.mailSubject, self.mailBody, addr);
	            break;

	    }

	}.bind(this);
	this.nameMembers = function( guestId) {
		for ( var i = 0; i < self.members().length; i++) {
			if ( self.members()[i].Id() === guestId) return self.members()[i].name();
		}
		return "";	//no data
	};
	this.guested = ko.pureComputed( function() {
        return self.guests();
	});
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
	this.selectedGroup = ko.observable('');
	this.getGroups = ko.pureComputed( function() {
	    var groupOpt = ko.utils.arrayMap(self.groups, function (v, i) {
	        return { value: v.Id, text: v.name };
	    });
	    groupOpt.unshift({ value: '-1', text: 'クリア' });
	    return groupOpt;
	});
	this.setMembers = ko.computed(function () {
	    var group = self.selectedGroup();
	    if ( 0 < group.length) {          // any member belong to selected group, set into guests.
	        self.guests(ko.utils.arrayMap(ko.utils.arrayFilter(self.members(), function (v, i) { return 0 <= $.inArray(+group, v.group()) }), function (v, i) { return v.Id() }));
	    }
	});
};
var Popup = function (elementId, msgTitle) {
    var self = this;
    this.popDiv = $('<div class="messageDialogs">').prop('id', elementId | 'PopupMessage');
    $(window.document.body).append(self.popDiv);
    self.popDiv.dialog({
        title: msgTitle,
        height: 80,
        width: 150,
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 250
        }, hide: {
            effect: "fade",
            duration: 250
        }
    });
    this.autoMessage = function (msg) {
        self.popDiv.empty().append( msg);
        self.popDiv.dialog("open");
        window.setTimeout(function () { self.popDiv.dialog("close") }, 2000);
    };
};
var msg;
function initialize( members, groups) {
    msg = new Popup("PopupMsg", "メール送信");
    ko.applyBindings(new viewModel(members, groups));
}
function postMail(sender, param, subject, body) {
    $.ajax({
        url: 'api/Mailers/',
        type: 'post',
        scriptCharset: 'utf-8',
        data: { fromAddr: sender, toList: param, subject: subject, mailBody: body },
        dataType: 'json'
    }).done(function (json) {
        msg.autoMessage('<p>送信完了<p>');
    }).fail(function () {
        msg.autoMessage('<p>送信失敗<p>');
    }).complete(function () {
    });
};
function putMail(sender, param, subject, body, addr) {
    $.ajax({
        url: 'api/Mailers/'+(addr=="cc"?"to":addr),
        type: 'put',
        scriptCharset: 'utf-8',
        data: { fromAddr: sender, toList: param, subject: subject, mailBody: body },
        dataType: 'json'
    }).done(function (json) {
        msg.autoMessage('<p>送信完了<p>');
    }).fail(function () {
        msg.autoMessage('<p>送信失敗<p>');
    }).complete(function () {
    });
};
