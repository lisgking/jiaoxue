#### 国际化相关的依赖包

+ [i18next](https://www.i18next.com/) - 国际化核心库
+ [react-i18next](https://react.i18next.com/) - i18next库的React包装库
+ [i18next-xhr-backend](https://github.com/i18next/i18next-xhr-backend) - 用于异步请求i18next翻译资源文件
+ [i18next-scanner-webpack](https://github.com/ph1p/i18next-scanner-webpack) - 用于提取翻译源码中的翻译文本，生成翻译资源文件
+ [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) - 用于探测浏览器当前语言环境用作默认语言

项目内的其它相关依赖：

+ `/src/i18n.js` - `i18next`实例对象模块
+ `/src/i18n-config.json` - 国际化相关配置数据，与Node.js模块共享
+ `/config/i18next-scanner.config.js` - 国际化翻译资源提取插件的配置文件
+ `/public/locales/{{语言代码}}/translations.json` - 翻译资源文件，将由插件自动生成

国际化相关的项目组件：

+ `LanguageProvider` - 国际化相关配置的供应商组件，用于统一包装和处理国际化相关的配置，包括`antd`的国际化配置，在语言环境切换后它将自动响应
+ `LanguageToggle` - 用于切换当前语言环境的组件

#### 国际化翻译使用方法

第一步：在需要使用翻译的组件引入`react-i18next`的`translate` HOC：

```javascript
import { translate } from 'react-i18next';
```

第二步：使用`translate` HOC包装需要翻译的组件：

```javascript
// 由于我已在项目组将transitions作为默认的命名空间
// 且目前项目中只使用了一个默认的命名空间生成的资源文件
// 所以可以省略掉命名空间参数：translate(['translations'])
@translate()
export default class MyComponent extends Component {
  // Code //
}
```

或者使用HOC的形式在导出时包装：

```javascript
class MyComponent extends Component {
  // Code //
}

export default translate()(MyComponent);
```

第三步：翻译具体的文本字符串：

假如我们已经存在如下翻译资源文件`translations.json`：

```json
{
  "HelloWorld": "你好世界！",
  "App": {
    "title": "应用标题",
    "description": "应用描述文本"
  },
  "sayHello": "你好！我的名字叫{{name}}。",
  "appleTotal": "{{count}} apple.",
  "appleTotal_plural": "{{count}} apples."
}
```

```javascript
@translate()
export default class MyComponent extends Component {
  render () {
    const { t } = this.props;
    const myName = 'Mike';

    return (
      <div>
        {/* 简单用法，第一个参数为翻译资源中的JSON键名 */}
        <h3>{t('HelloWorld')}</h3>

        {/* 推荐用法，对象属性形式 */}
        <h3>{t('App.title')}</h3>
        <p>{t('App.description')}</p>

        {/* 插入变量 */}
        <p>{t('sayHello', {name: myName})}</p>

        {/* 复数形式，通常用于英文中 */}
        <p>{t('appleTotal', {count: 1})}</p> {/* 输出：1 apple. */}
        <p>{t('appleTotal', {count: 2})}</p> {/* 输出：2 apples. */}
      </div>
    );
  }
}
```

如何在非JSX的脚本或模块中或工具函数中使用翻译函数？你只需导入`i18next`的实例对象，调用实例对象上的`t`方法即可：

```javascript
// message.js
import i18n from '../i18n';

function showMessage () {
  alert( i18n.t('App.errorMessage') );
}

showMessage();
```

更多详细用法请参见[i18next](https://www.i18next.com/)官方文档

### 国际化翻译规范与注意事项（**重点**）

国际化翻译资源文件路径：`/public/locales/{{语言代码}}/translations.json`

> 最佳做法应该是使用i18next的Namespaces将翻译资源文件分模块命名，以便模块化的管理与维护翻译资源文件，但为了维护方便我们暂时只使用一个命名空间与资源文件`translations.json`

手动维护翻译资源文件是一件很痛苦且容易出错的事情，所以我在项目中引入了自动化的翻译资源文件生成方案，以提高开发效率，降低维护成本。使用此方案必须遵循如下规范：

* **统一使用对象属性的形式来命名翻译键名**，将组件、容器组件或页面的名称作为对象名称，然后其属性为具体翻译的唯一键名，还可以将一些通用的翻译放到`common`对象上。此命名方案的好处在于不引入`i18next`文件命名空间的同时，又能最大化的避免键名冲突的风险。下面是一些命名示例：

```javascript
// 通用
t('common.ok');
t('common.cancel');
t('common.remove');
t('App.title');

// 组件相关
t('App.description');
t('Home.title');
t('About.description');
t('Dialog.okText');
t('ConfirmDialog.okText');
t('ConfirmDialog.cancelText');
```

* **所有的翻译必须带上默认值选项`defaultValue`**，这是为了自动化翻译提取工具能够自动的生成翻译资源的默认语言资源文件，如此我们就无需再去维护默认语言的资源文件（此项目默认语言为中文），只需维护英文或其他语言的资源文件的翻译工作。同时也能提升源码的可读性和可维护性。`defaultValue`将会自动生成为所有语言翻译资源文件相关键的对应翻译值，以下为常规翻译示例：

```javascript
t('HelloWorld', {defaultValue: '你好世界！'});
t('App.title', {defaultValue: '应用标题'});
t('App.description', {defaultValue: '应用描述'});
t('sayHello', {defaultValue: '你好！我的名字叫{{name}}。', name: myName});

// 特殊情况，翻译提取工具会自动生成两条翻译
// 单数形式："appleTotal": "{{count}} apple.",
// 复数形式："appleTotal_plural": "{{count}} apple."
const appleCount = 10;
t('appleTotal', {defaultValue: '{{count}} apple.', count: appleCount});
```

* **翻译的键名与`defaultValue`必须为静态字符串直接量**，由于翻译提取工具采用的是静态词法解析，而非运行时的解析。所以你不能使用变量、变量拼接、字符串拼接、带变量的ES6模板字符串等来用作翻译的键名或`defaultValue`，如下所示均为无法解析的错误示例：

```javascript
t('Hello' + 'World', {defaultValue: '你好世界！'});
t('HelloWorld', {defaultValue: '你好' + '世界！'});

const wd = 'World';
const who = '世界！';
t('Hello' + wd, {defaultValue: '你好世界！'});
t(`Hello${wd}`, {defaultValue: '你好世界！'});
t('HelloWorld', {defaultValue: '你好' + who});
```

* **`defaultValue`中无法使用嵌套翻译`$t(key)`**，你无法只`defaultValue`中使用嵌套翻译，这将无法正确解析，但你任然可以翻译资源文件中使用嵌套翻译，关于嵌套翻译的更多信息请查阅官方的文档[链接](https://www.i18next.com/translation-function/nesting)，或者你也可以使用插入变量的形式来代替嵌套翻译：

```javascript
t('Home.title', {
  defaultValue: '{{title}} - {{description}}',
  title: t('App.title', {defaultValue: '应用标题'}),
  description: t('App.description', {defaultValue: '应用描述'})
});
```

* **不要重命名或间接引用翻译函数`t`**，同样由于翻译提取工具采用的是静态词法解析的原因，你必须直接使用翻译函数`t`，或在实例对象上调用`i18n.t`，否则将无法解析。你只能通过`t`,`i18n.t`,`i18next.t`或`<Trans>`组件的方式方式来调用翻译函数，其它方式都将无法解析，如下示例：

```javascript
// 正确方式：
t('App.title');
i18n.t('App.title');
i18next.t('App.title');

<Trans i18nKey="App.title">
  应用标题
</Trans>

// 错误方式
import i18nInstance from '../i18n';
i18nInstance.t('App.title')

// 错误方式
const _t = t;
_t('App.title');

// 错误方式
const Translate = Trans;
<Translate i18nKey="App.title">
  应用标题
</Translate>
```
