# npm

依赖管理器

其他依赖管理器还有：yarn/cnpm/pnpm/ni

npm 依赖声明文件 `package.json`

## npm 脚本 npm scripts

终端中执行 `npm run` 可以查看所有 npm 脚本

将当前目录的 node_modules/.bin 子目录加入 PATH 变量，执行结束后，再将 PATH 变量恢复原样。所以当前目录的 node_modules/.bin 子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。

## 通配符

\*表示任意文件名，\*\*表示任意一层子目录。

```json
{ "lint": "jshint **/*.js" }
```

## 传参

向 npm 脚本传入参数，要使用 `--` 标明。

`$ npm run lint -- --watch`

## 执行顺序

如果是并行执行（即同时的平行执行），可以使用`&`符号。

`npm run script1.js & npm run script2.js`

如果是继发执行（即只有前一个任务成功，才执行下一个任务），可以使用`&&`符号。

`npm run script1.js && npm run script2.js`

## 默认脚本

npm run start 的默认值是 node server.js，前提是项目根目录下有 server.js 这个脚本；

npm run install 的默认值是 node-gyp rebuild，前提是项目根目录下有 binding.gyp 文件。

## 钩子

npm 脚本有 pre 和 post 两个钩子。举例来说，build 脚本命令的钩子就是 prebuild 和 postbuild。

用户执行 npm run build 的时候，会自动按照下面的顺序执行。`npm run prebuild && npm run build && npm run postbuild`

自定义的脚本命令也可以加上 pre 和 post 钩子。比如，myscript 这个脚本命令，也有 premyscript 和 postmyscript 钩子。

npm 提供一个 npm_lifecycle_event 变量，返回当前正在运行的脚本名称

## npm 的内部变量

```json
{
  "name": "foo",
  "version": "1.2.5",
  "scripts": {
    "view": "node view.js"
  }
}
```

```js
// view.js
console.log(process.env.npm_package_name); // foo
console.log(process.env.npm_package_version); // 1.2.5
```

如果是 Bash 脚本，可以用 `$npm_package_name` 和 `$npm_package_version` 取到这两个值。

## npm run serve / yarn serve

都是对 `package.json` 进行解析，运行的是 scripts 属性里的命令 `serve`

```json
{
  "scripts": {
    "serve": "vue-cli-service serve"
  }
}
```

如果直接在命令行执行 `vue-cli-service serve`，是不会从 `node_modules/.bin` 中查找可执行程序的，运行会报错。

例如 ​`​@vue/cli-service​`​ 的 ​`​package.json​`​ 文件，有个 bin 字段，当我们运行 ​`​npm i @vue/cli-service​`​ 这条命令时，npm 就会在 ​`​node_modules/.bin/​`​ 目录中创建好以 ​`​vue-cli-service​`​ 为名的几个可执行文件了。

`node_modules/@vue/cli-service/package.json`

```json
{
  "name": "@vue/cli-service",
  "version": "5.0.8",
  "description": "local service for vue-cli projects",
  "main": "lib/Service.js",
  "typings": "types/index.d.ts",
  "bin": {
    "vue-cli-service": "bin/vue-cli-service.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuejs/vue-cli.git",
    "directory": "packages/@vue/cli-service"
  },
  "keywords": ["vue", "cli"],
  "author": "Evan You"
  // ...
}
```

`node_modules/@vue/cli-service/bin/vue-cli-service.js`

```js
#!/usr/bin/env node

const { semver, error } = require("@vue/cli-shared-utils");
const requiredVersion = require("../package.json").engines.node;

if (
  !semver.satisfies(process.version, requiredVersion, {
    includePrerelease: true,
  })
) {
  error(
    `You are using Node ${process.version}, but vue-cli-service ` +
      `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  );
  process.exit(1);
}

const Service = require("../lib/Service");
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd());

const rawArgv = process.argv.slice(2);
const args = require("minimist")(rawArgv, {
  boolean: [
    // build
    // FIXME: --no-module, --no-unsafe-inline, no-clean, etc.
    "modern",
    "report",
    "report-json",
    "inline-vue",
    "watch",
    // serve
    "open",
    "copy",
    "https",
    // inspect
    "verbose",
  ],
});
const command = args._[0];

service.run(command, args, rawArgv).catch((err) => {
  error(err);
  process.exit(1);
});
```

`node_modules/.bin/vue-cli-service` 可执行文件，（软连接）

- unix 系默认的可执行文件，必须输入完整文件名 `vue-cli-service`
- windows cmd 中默认的可执行文件，当我们不添加后缀名时，自动根据 pathext 查找文件 `vue-cli-service.cmd`
- windows PowerShell 中可执行文件，可以跨平台 `vue-cli-service.ps1`

## 参考

[npm scripts-ruanyifeng](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)
