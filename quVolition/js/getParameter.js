// パラメータを取得して連想配列で返す
function getParameter() {
	var paramsArray = [];
	var url = location.href; 
	var sct = url.split("?");
	if ( 1 < sct.length) {
		var prm = sct[1].split("&");
		for ( i = 0; i < prm.length; i++) {
		   var itm = prm[i].split("=");
		   paramsArray[itm[0]] = itm[1];
		}
	}
	return paramsArray;
};