/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-ellipsis-h': '&#xe902;',
		'icon-battery-1': '&#xe90c;',
		'icon-battery-2': '&#xe90d;',
		'icon-battery-3': '&#xe90e;',
		'icon-battery-0': '&#xe910;',
		'icon-battery': '&#xe911;',
		'icon-circle': '&#xe905;',
		'icon-circles': '&#xe906;',
		'icon-bell1': '&#xe903;',
		'icon-alarm': '&#xe903;',
		'icon-notification': '&#xe903;',
		'icon-grid': '&#xe904;',
		'icon-icons': '&#xe904;',
		'icon-apps': '&#xe904;',
		'icon-squares': '&#xe904;',
		'icon-grid1': '&#xe900;',
		'icon-spinner4': '&#xe97d;',
		'icon-info': '&#xea0c;',
		'icon-arrow-up-right2': '&#xea3b;',
		'icon-radio-checked': '&#xea54;',
		'icon-cross': '&#xe901;',
		'icon-cancel': '&#xe901;',
		'icon-close': '&#xe901;',
		'icon-quit': '&#xe901;',
		'icon-remove': '&#xe901;',
		'icon-reset': '&#xe916;',
		'icon-rotate-cw': '&#xe917;',
		'icon-cw': '&#xe917;',
		'icon-rotate-ccw': '&#xe918;',
		'icon-ccw': '&#xe918;',
		'icon-cog': '&#xe919;',
		'icon-backward': '&#xe91a;',
		'icon-player': '&#xe91a;',
		'icon-volume-low': '&#xe91b;',
		'icon-volume': '&#xe91b;',
		'icon-audio': '&#xe91b;',
		'icon-speaker': '&#xe91b;',
		'icon-player1': '&#xe91b;',
		'icon-play': '&#xe91c;',
		'icon-player2': '&#xe91c;',
		'icon-pause': '&#xe91d;',
		'icon-player3': '&#xe91d;',
		'icon-volume-medium': '&#xe91e;',
		'icon-volume1': '&#xe91e;',
		'icon-audio1': '&#xe91e;',
		'icon-speaker1': '&#xe91e;',
		'icon-player4': '&#xe91e;',
		'icon-volume-mute': '&#xe91f;',
		'icon-volume2': '&#xe91f;',
		'icon-audio2': '&#xe91f;',
		'icon-speaker2': '&#xe91f;',
		'icon-player5': '&#xe91f;',
		'icon-volume-mute1': '&#xe920;',
		'icon-volume3': '&#xe920;',
		'icon-audio3': '&#xe920;',
		'icon-player6': '&#xe920;',
		'icon-volume-high': '&#xe921;',
		'icon-volume4': '&#xe921;',
		'icon-audio4': '&#xe921;',
		'icon-speaker3': '&#xe921;',
		'icon-player7': '&#xe921;',
		'icon-forward': '&#xe922;',
		'icon-player8': '&#xe922;',
		'icon-menu': '&#xe923;',
		'icon-list': '&#xe923;',
		'icon-options': '&#xe923;',
		'icon-lines': '&#xe923;',
		'icon-hamburger': '&#xe923;',
		'icon-file-video': '&#xe924;',
		'icon-file': '&#xe924;',
		'icon-document': '&#xe924;',
		'icon-file-camera': '&#xe924;',
		'icon-file-video1': '&#xe925;',
		'icon-file1': '&#xe925;',
		'icon-document1': '&#xe925;',
		'icon-file-camera1': '&#xe925;',
		'icon-compass': '&#xe926;',
		'icon-direction': '&#xe926;',
		'icon-location': '&#xe926;',
		'icon-file-text': '&#xe927;',
		'icon-file2': '&#xe927;',
		'icon-document2': '&#xe927;',
		'icon-list1': '&#xe927;',
		'icon-paper': '&#xe927;',
		'icon-calendar': '&#xe928;',
		'icon-date': '&#xe928;',
		'icon-schedule': '&#xe928;',
		'icon-time': '&#xe928;',
		'icon-day': '&#xe928;',
		'icon-checkbox-checked': '&#xe929;',
		'icon-checkbox': '&#xe929;',
		'icon-tick': '&#xe929;',
		'icon-checked': '&#xe929;',
		'icon-selected': '&#xe929;',
		'icon-compass1': '&#xe92a;',
		'icon-direction1': '&#xe92a;',
		'icon-location1': '&#xe92a;',
		'icon-checkmark': '&#xe92b;',
		'icon-cross1': '&#xe92c;',
		'icon-bell': '&#xe92d;',
		'icon-cross2': '&#xe914;',
		'icon-reset1': '&#xe912;',
		'icon-stack': '&#xe90b;',
		'icon-cog1': '&#xe90a;',
		'icon-pencil': '&#xe909;',
		'icon-enlarge': '&#xe908;',
		'icon-calendar1': '&#xe907;',
		'icon-bell11': '&#xe915;',
		'icon-alarm1': '&#xe915;',
		'icon-notification1': '&#xe915;',
		'icon-grid2': '&#xe913;',
		'icon-icons1': '&#xe913;',
		'icon-apps1': '&#xe913;',
		'icon-squares1': '&#xe913;',
		'icon-camera': '&#xe90f;',
		'icon-file-text1': '&#xe92e;',
		'icon-file-video2': '&#xe92f;',
		'icon-compass2': '&#xe94a;',
		'icon-drawer': '&#xe95c;',
		'icon-drawer2': '&#xe95d;',
		'icon-spinner41': '&#xe97e;',
		'icon-menu1': '&#xe9bd;',
		'icon-minus': '&#xea0b;',
		'icon-checkmark1': '&#xea10;',
		'icon-play3': '&#xea1c;',
		'icon-pause2': '&#xea1d;',
		'icon-backward2': '&#xea1f;',
		'icon-forward3': '&#xea20;',
		'icon-volume-high1': '&#xea26;',
		'icon-volume-medium1': '&#xea27;',
		'icon-volume-low1': '&#xea28;',
		'icon-volume-mute2': '&#xea29;',
		'icon-volume-mute21': '&#xea2a;',
		'icon-checkbox-checked1': '&#xea52;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
