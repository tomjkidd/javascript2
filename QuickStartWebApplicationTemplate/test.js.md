#Follow the RequireJS Rabbit Hole

The benefits of using RequireJS to modularize javascript code provides incentive enough to use it. Being able to manage other resources that are needed for a page is just plain [delicious](http://www.hulu.com/watch/19178).


##Goals

The main goals of this post are to describe how to achieve the following things:

* Figure out how to load script tags with a plugin to load templates for knockout

### Assumed Background

It is assumed that the reader is at least somewhat familiar with:

The [javascript][js] language

The following frameworks: [jQuery][jq] , [knockout][ko] , [RequireJS][require]

   [ko]: http://knockoutjs.com "Knockout home page"
   [jq]: http://jquery.com/ "jQuery home page"
   [js]: https://developer.mozilla.org/en-US/docs/Web/JavaScript "MDN JavaScript page"	
   [require]: http://requirejs.org/ "RequireJS home page"

## Motivation

I frequently use [knockout.js][ko] to create the user interface pieces for web development.
One of the best things about knockout is the support for [Native Templating][koNativeTemplating],
which easily allows View Models to be integrated with html elements.

Named templates can be added to a page, each one inside of it's own script tag. Following the examples on the knockout page, it is easy to create a named template and use it. This is fine if you only want to use the template on that page. Most of the time, though, the desire is to create a template and be able to use it anywhere.

So to get started, this begs the question: how do I insert these script tags dynamically?

   [ko]: http://knockoutjs.com "Knockout home page"
   [koNativeTemplating]: http://knockoutjs.com/documentation/template-binding.html "Knockout template binding"
   [jq]: http://jquery.com/ "jQuery home page"
   [js]: https://developer.mozilla.org/en-US/docs/Web/JavaScript "MDN JavaScript page"	
   [require]: http://requirejs.org/ "RequireJS home page"

### Dynamically Loading Script Tags

At the low level, most attempts to create and load a script tag go something like this
([RequireJS](http://requirejs.org/docs/why.html#8) uses this approach with JavaScript resources to asynchronously load the dependencies of a module):

	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = src || 'path/to/script.js';
	s.innerHTML = html || 'scriptText';
	document.getElementsByTagName('head')[0].appendChild(s);

For our knockout script, the only things that need to change are that the type should be set to 'text/html' and an id should be added to the tag so that knockout can find it:

	var s = document.createElement('script');
	s.id = id;
	s.type = 'text/html';
	s.src = src || 'path/to/template.html';
	s.innerHTML = html || 'templateText';
	document.getElementsByTagName('head')[0].appendChild(s);	

We have to provide the template text (html variable) to our application script somehow, and have already ruled out putting it in our page's html directly. It would be equally unappealing to put it in the application script as a string variable in javascript. Storing it as a text file and being able to access it directly would be ideal. What options do we have?

The RequireJS plugin [text!](http://requirejs.org/docs/api.html#text) already exists to allow text file dependencies to be loaded.

#### Loading HTML with the text! plugin

This part is actually quite trivial, and is described in the 'Usage' section of [text!](https://github.com/requirejs/text)'s github project page. The following example illustrates loading the text file FormattedTextBox.html in as the variable textBoxTemplate.

	require.config({
		paths: {
			'text': '../Scripts/lib/text'
		}
	});
	require(['jquery', 'knockout', 'underscore', 'util/utilities', 'app/FormattedTextBox',
		'text!../Scripts/templates/FormattedTextBox.html',
		'domReady!',
		], function ($, ko, _, util, textBox, textBoxTemplate) {
			var check = textBoxTemplate;
	});
	
However, the way that these files are loaded allows access to the text in the body of the require function. This means that the requirement of the text will give us the text once everything has loaded. We could then use a loader script to insert the template in a script tag, but this is an asynchronous call, and the script may try to apply bindings to the template before it actually exists in our script.
What we really want is access to the text files during loading, and a dependency on the script tags being inserted into the DOM before getting to the body of the require function callback.

Writing a RequireJS plugin to load the text and create the script tags would allow the templates to be used as dependencies in the desired fashion.

### Creating a Template Loader Plugin

The [text!](https://github.com/requirejs/text/blob/master/text.js) plugin can actually be used to learn a lot of valuable information about creating a working plugin. When creating a plugin yourself, looking at text! as an example provides solutions for parsing urls, taking part in code optimizations, and using other development environments like node.js and rhino.

The text! module uses [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) to load the text files. Despite the name, the data retrieved using the XHR doesn't have to be xml, and is pretty straight forward to [use](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest?redirectlocale=en-US&redirectslug=DOM%2FXMLHttpRequest%2FUsing_XMLHttpRequest). 

	var oReq = new XMLHttpRequest();
	oReq.onload = reqListener;
	oReq.open("get", "path/to/template.html", true);
	oReq.send();

The key areas of interest in the code were the **load** and **finishLoad** functions, because the [load](http://requirejs.org/docs/plugins.html#apiload) function is the heart of how to create my template loader plugin. **load** is called by RequireJS and allows developers to describe how to load their resources, and once finished how to indicate the resource is loaded, through the **onload** argument passed into the load function.

It is important to design what the **load** function should do. At first, it might seem good enough to just use the whole path, like you would with RequireJS in any other case, and just use the template syntax directly.

	require(['jquery', 'knockout', 'pluginName!path/to/template/template.html'], function ($, ko) {
	});

This would work easily, and you wouldn't have to do anything special in the plugin to assume or guess about path locations. But what happens when you have a script that depends on a whole lot of templates? You quickly get a lot of bloat. If we only want to create the plugin for the specific purpose of loading our html templates, we can aim for a small sytax.

	require.config({
		paths: {
			'jquery': '../Scripts/lib/jquery',
			'knockout': '../Scripts/lib/knockout',
			'pn': '../Scripts/util/pluginName'
		},
		config: {
			'pn': {
				templatePath: '../Scripts/templates',
				extension: 'html'
			}
		}
	});
	
By creating a templatePath config variable and using a default extension when none is provided (.html), I can configure a common location for all of my templates and then use a more consise form to load dependencies.
	
	require(['jquery', 'knockout', 'pn!Template1', 'pn!Template2', ..., 'pn!TemplateN'], function ($, ko){
	});

This requires me to depend on 'module' in the plugin, and to provide the correct uri before the XHR is made. But, putting all the pieces together, the plugin definition is pretty simple.

	define(['module'], function (module) {
		'use strict';
		var modconfig = module.config();
		var koTemplateLoader = {
			version: '0.0.1',
			load: function (name, parentRequire, onload, config) {
				var oReq = new XMLHttpRequest();
				var url =  modconfig.templatePath + '/' + name + modconfig.extension
				oReq.open("get", url, true);
				oReq.onreadystatechange = function () {
					if (oReq.readyState === 4) {
						var s = document.createElement('script');
						s.id = name;
						s.type = 'text/html';
						s.src = url;
						s.innerHTML = oReq.responseText;
						document.getElementsByTagName('head')[0].appendChild(s);
						onload(oReq.responseText);
					}
				};
				oReq.send(null);
			}
		};
		return koTemplateLoader;
	});

This plugin is very optimistic, in that there is no error handling. It's also not extremely flexible, relying on a single configured template directory and appending the file extension directly. But this was intended to keep the size of code really small for the purpose of illustration. The basic ideas are working together here: our **load** function will create the url for the location to get our template text from based on our require dependencies. It will then register a callback to create the script tag once the template text is available. Finally, after our template has been inserted, **onload** is called to let require know that the resource has been loaded. 