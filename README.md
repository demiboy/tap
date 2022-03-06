# 🔖 tap

Generate projects in a... tap

# 📋 Usage

First of all, install it:

```sh
$ npm i -g tap
```

Then, you can use it like so:

```sh
$ tap
$ tap [command] [...args]
```

Here are some examples:

```sh
$ tap
$ tap help
$ tap help install
$ tap install demiboy/gba pinkcig/tap # Installs a template
```

# 🔧 Creating a template

All you need to do is create a .taprc.js file in your project root, then use `defineConfig` to define your configuration.  
All the values returned by the prompt, can be used in Mustache's templates, which should be postfixed with .template

For example:

`.taprc.js`

```js
/**
 * Do note that, as the question is an array of inquirer questions
 * you can use all of prompts' features and power, eg: validation etc
 */
module.exports = require('@pinkcig/tap').defineConfiguration({
	questions: [
		{
			name: 'description',
			message: "What's the description of your project?",
			default: 'No description provided.',
		},
		{
			name: 'author',
			message: "What's the author of your project?",
			default: 'No author provided.',
		},
		{
			name: 'repository',
			message: "What's the repository of your project?",
			default: 'No repository provided.',
		},
	],
});
```

`README.md.template`

```md
# 🔖 {{name}}

{{description}}

As internally tap uses Mustache, much like Inquirer, you can use all of it's features and power as well!
```

`package.json.template`

```json
{
	"name": "{{name}}",
	"description": "{{description}}",
	"author": "{{author}}",
	"repository": "{{repository}}"
}
```
