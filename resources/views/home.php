<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="Phone verification at no cost!">

    <title>Dial2Verify-Twilio</title>

	<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">

	<!--[if lte IE 8]>
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/grids-responsive-old-ie-min.css">
	<![endif]-->

	<!--[if gt IE 8]><!-->
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/grids-responsive-min.css"> 
	<!--<![endif]-->

	<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css">

    <!--[if lte IE 8]>
    <link rel="stylesheet" href="/combo/1.18.13?/css/layouts/marketing-old-ie.css">
    <![endif]-->

    <!--[if gt IE 8]><!-->
    <link rel="stylesheet" href="http://purecss.io/combo/1.18.13?/css/layouts/marketing.css">
    <!--<![endif]-->
    
	<!--[if lt IE 9]>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script>
	<![endif]-->

	<link rel="stylesheet" type="text/css" href="node_modules/sweetalert2/dist/sweetalert2.min.css">
	<link rel="stylesheet" type="text/css" href="node_modules/csshake/dist/csshake.min.css">

</head>
<body>

	<div class="header">
	    <div class="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
	        <a class="pure-menu-heading" href="">Dial2Verify-Twilio</a>
	    </div>
	</div>

	<div class="splash-container">
	    <div class="splash">
	        
	        <!--<h2 class="splash-head">Big Bold Text</h2>-->
	        <p class="splash-subhead">
	            Phone verification at no cost!
	        </p>
	        
	        <my-app>Loading...</my-app>
	    </div>
	</div>

	<div class="content-wrapper">
	    <div class="footer l-box is-center">
	        Theme layout from PureCSS. <?php echo $version; ?>
	    </div>

	</div>

	<a href="https://github.com/natsu90/dial2verify-twilio"><img style="z-index: 5; position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>

	<script>
	(function (root) {
		// -- Data --
		root.YUI_config = {"version":"3.17.2","base":"http:\u002F\u002Fyui.yahooapis.com\u002F3.17.2\u002F","comboBase":"http:\u002F\u002Fyui.yahooapis.com\u002Fcombo?","comboSep":"&","root":"3.17.2\u002F","filter":"min","logLevel":"error","combine":true,"patches":[],"maxURLLength":2048,"groups":{"vendor":{"combine":true,"comboBase":"\u002Fcombo\u002F1.18.13?","base":"\u002F","root":"\u002F","modules":{"css-mediaquery":{"path":"vendor\u002Fcss-mediaquery.js"},"handlebars-runtime":{"path":"vendor\u002Fhandlebars.runtime.js"}}},"app":{"combine":true,"comboBase":"\u002Fcombo\u002F1.18.13?","base":"\u002Fjs\u002F","root":"\u002Fjs\u002F"}}};
		root.app || (root.app = {});
		root.app.yui = {"use":function () { return this._bootstrap('use', [].slice.call(arguments)); },"require":function () { this._bootstrap('require', [].slice.call(arguments)); },"ready":function (callback) { this.use(function () { callback(); }); },"_bootstrap":function bootstrap(method, args) { var self = this, d = document, head = d.getElementsByTagName('head')[0], ie = /MSIE/.test(navigator.userAgent), callback = [], config = typeof YUI_config != "undefined" ? YUI_config : {}; function flush() { var l = callback.length, i; if (!self.YUI && typeof YUI == "undefined") { throw new Error("YUI was not injected correctly!"); } self.YUI = self.YUI || YUI; for (i = 0; i < l; i++) { callback.shift()(); } } function decrementRequestPending() { self._pending--; if (self._pending <= 0) { setTimeout(flush, 0); } else { load(); } } function createScriptNode(src) { var node = d.createElement('script'); if (node.async) { node.async = false; } if (ie) { node.onreadystatechange = function () { if (/loaded|complete/.test(this.readyState)) { this.onreadystatechange = null; decrementRequestPending(); } }; } else { node.onload = node.onerror = decrementRequestPending; } node.setAttribute('src', src); return node; } function load() { if (!config.seed) { throw new Error('YUI_config.seed array is required.'); } var seed = config.seed, l = seed.length, i, node; if (!self._injected) { self._injected = true; self._pending = seed.length; } for (i = 0; i < l; i++) { node = createScriptNode(seed.shift()); head.appendChild(node); if (node.async !== false) { break; } } } callback.push(function () { var i; if (!self._Y) { self.YUI.Env.core.push.apply(self.YUI.Env.core, config.extendedCore || []); self._Y = self.YUI(); self.use = self._Y.use; if (config.patches && config.patches.length) { for (i = 0; i < config.patches.length; i += 1) { config.patches[i](self._Y, self._Y.Env._loader); } } } self._Y[method].apply(self._Y, args); }); self.YUI = self.YUI || (typeof YUI != "undefined" ? YUI : null); if (!self.YUI && !self._injected) { load(); } else if (self._pending <= 0) { setTimeout(flush, 0); } return this; }};
		root.YUI_config || (root.YUI_config = {});
		root.YUI_config.seed = ["http:\u002F\u002Fyui.yahooapis.com\u002Fcombo?3.17.2\u002Fyui\u002Fyui-min.js"];
		root.YUI_config.groups || (root.YUI_config.groups = {});
		root.YUI_config.groups.app || (root.YUI_config.groups.app = {});
		root.YUI_config.groups.app.modules = {"start\u002Fapp":{"path":"start\u002Fapp.js","requires":["handlebars-runtime","yui","base-build","router","pjax-base","view","start\u002Fmodels\u002Fgrid","start\u002Fviews\u002Finput","start\u002Fviews\u002Foutput","start\u002Fviews\u002Fdownload"]},"start\u002Fmodels\u002Fgrid":{"path":"start\u002Fmodels\u002Fgrid.js","requires":["yui","querystring","base-build","model","model-sync-rest","start\u002Fmodels\u002Fmq"]},"start\u002Fmodels\u002Fmq":{"path":"start\u002Fmodels\u002Fmq.js","requires":["css-mediaquery","attribute","base-build","model","model-list"]},"start\u002Fviews\u002Fdownload":{"path":"start\u002Fviews\u002Fdownload.js","requires":["yui","base-build","querystring","view"]},"start\u002Fviews\u002Finput":{"path":"start\u002Fviews\u002Finput.js","requires":["base-build","start\u002Fmodels\u002Fmq","start\u002Fviews\u002Ftab"]},"start\u002Fviews\u002Foutput":{"path":"start\u002Fviews\u002Foutput.js","requires":["base-build","escape","start\u002Fviews\u002Ftab"]},"start\u002Fviews\u002Ftab":{"path":"start\u002Fviews\u002Ftab.js","requires":["yui","base-build","view"]}};
	}(this));
	</script>
	<script>
	app.yui.use('node-base', 'node-event-delegate', function (Y) {
	    // This just makes sure that the href="#" attached to the <a> elements
	    // don't scroll you back up the page.
	    Y.one('body').delegate('click', function (e) {
	        e.preventDefault();
	    }, 'a[href="#"]');
	});
	</script>
	<script type="text/javascript" src="node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
	<script type="text/javascript" src="node_modules/event-source-polyfill/eventsource.min.js"></script>
	<!-- for IE support -->
	<script src="node_modules/es6-promise-polyfill/promise.min.js"></script>
    <!-- IE required polyfills, in this exact order -->
    <script src="node_modules/es6-shim/es6-shim.min.js"></script>
    <script src="node_modules/systemjs/dist/system-polyfills.js"></script>
    <script src="node_modules/angular2/es6/dev/src/testing/shims_for_IE.js"></script>   

    <script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <script src="node_modules/rxjs/bundles/Rx.js"></script>
    <script src="node_modules/angular2/bundles/angular2.dev.js"></script>
    <script src="node_modules/angular2/bundles/http.dev.js"></script>
	<script type="text/javascript">
		System.config({
	        packages: {        
	          app: {
	            format: 'register',
	            defaultExtension: 'js'
	          }
	        }
	      });
	      System.import('app/main')
	            .then(null, console.error.bind(console));
	</script>
</body>
</html>
