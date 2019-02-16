declare namespace Yep {
    /** html 选择器（Emment/ZenCoding） */
    type htmlString = string;
    interface Hooks {
        /**
         * 获取属性值
         * @param elem 元素
         * @param computed 是否计算
         * @param extra 尝试转为数字
         */
        get(elem: Element, computed: boolean, extra: any): any,
        /**
         * 设置属性值
         * @param elem 元素
         * @param value 属性值
         * @param extra 尝试转为数字
         */
        set(elem: Element, value: string, extra: any): any
    }
}

interface V2kitStatic {
    /** 渲染控件 */
    (tag: string, options?: Yep.UsePlainObject): Yep.V2Control,
    /** 控件原型 */
    readonly fn: Yep.V2Control,
    /**
     * 获取对象数据类型
     * @param object 需要识别的对象。
     * @returns {String} 返回对象的类型字符串。
     */
    type(object: any): typeof object;
    /**
    * 对象拓展(与extend的效果一样)
    * @param array 需要继承的对象集合。
    * @returns 返回数组中的第一个非{Boolean}型对象。
    */
    extension<T, K extends keyof T>(array: Array<T>): T;
    /**
     * 对象拓展
     * @param callback 用于处理继承逻辑的函数
     * @param array 需要继承的对象集合。
     * @returns 返回数组中的第一个非{Boolean}型对象。
     */
    extension<T, K extends keyof T>(callback: (value: T[K], option: T[K]) => any, array: Array<T>): T;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param target 目标对象。
     * @param objectN 任意多个对象。
     * @returns 返回目标对象。
     */
    extend(target: any, ...objectN: any[]): any;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param objectN 任意多个对象。
     * @returns 返回目标对象。
     */
    extend(deep: boolean, target: any, ...objectN: any[]): any;
    /**
     * 对象继承（所有对象的所有属性都会继承到“this”对象中）
     * @param object 将此对象继承到 this 对象中。
     * @returns 返回 目标对象。
     */
    extend<T, U>(object: T): T & this;
    /**
     * 对象继承（所有对象的所有属性都会继承到“this”对象中）
     * @param deep 为 true 时深度继承。
     * @param object 将此对象继承到 this 对象中。
     * @returns 返回 目标对象。
     */
    extend<T, U>(deep: boolean, object: T): T & this;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param target 目标对象。
     * @param object 将此对象继承到 target 对象中。
     */
    extend<T, U>(target: T, object: U): T & U;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param object 将此对象继承到 target 对象中。
     */
    extend<T, U>(deep: boolean, target: T, object: U): T & U;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param target 目标对象。
     * @param object1 将此对象继承到 target 对象中。
     * @param objectN 将此对象继承到 target 对象中。
     */
    extend<T, U, N>(target: T, object1: U, ...objectN: N[]): T & U & N;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param object1 将此对象继承到 target 对象中。
     * @param objectN 将此对象继承到 target 对象中。
     */
    extend<T, U, N>(deep: boolean, target: T, object1: U, ...objectN: N[]): T & U & N;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param target 目标对象。
     * @param object1 将此对象继承到 target 对象中。
     * @param deep2 标识其后面对象是深度继承还是浅度继承。
     * @param objectN2 将此对象继承到 target 对象中。
     */
    extend<T, U, N>(target: T, object1: U, deep2: boolean, ...objectN2: N[]): T & U & N;
    /**
     * 对象继承（目标对象后的所有对象的所有属性都会继承到目标对象中）
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param object1 将此对象继承到 target 对象中。
     * @param deep2 标识其后面对象是深度继承还是浅度继承。
     * @param objectN2 将此对象继承到 target 对象中。
     */
    extend<T, U, N>(deep: boolean, target: T, object1: U, deep2: boolean, ...objectN2: N[]): T & U & N;
    /**
     * 对象继承
     * @param target 目标对象。
     * @param objectN 将此对象继承到 target 对象中。
     * @returns (目标对象后的所有对象中“target 不包含”的属性都会继承到目标对象中。)
     */
    improve(target: any, ...objectN: any[]): any;
    /**
     * 对象继承.
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param objectN 将此对象继承到 target 对象中。
     * @returns (目标对象后的所有对象中“target 不包含”的属性都会继承到目标对象中。)
     */
    improve(deep: boolean, target: any, ...objectN: any[]): any;
    /**
     * 对象继承
     * @param object 将此对象继承到 this 对象中。
     * @returns 目标对象后的所有对象中“this 不包含”的属性都会继承到目标对象中。
     */
    improve<T, U>(object: T): T & this;
    /**
     * 对象继承
     * @param deep 为 true 时深度继承。
     * @param object 将此对象继承到 this 对象中。
     * @returns 目标对象后的所有对象中“this 不包含”的属性都会继承到目标对象中。
     */
    improve<T, U>(deep: boolean, object: T): T & this;
    /**
     * 对象继承
     * @param target 目标对象。
     * @param object 将此对象继承到目标对象中。
     * @returns 目标对象后的所有对象中“target不包含”的属性都会继承到目标对象中。
     */
    improve<T, U>(target: T, object: U): T & U;
    /**
     * 对象继承
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param object 将此对象继承到目标对象中。
     * @returns 目标对象后的所有对象中“target不包含”的属性都会继承到目标对象中。
     */
    improve<T, U>(deep: boolean, target: T, object: U): T & U;
    /**
     * 对象继承
     * @param target 目标对象。
     * @param objectN 将此对象继承到目标对象中。
     * @returns 目标对象后的所有对象中“target不包含”的属性都会继承到目标对象中。
     */
    improve<T, N>(target: T, ...objectN: N[]): T & N;
    /**
     * 对象继承
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param objectN 将此对象继承到目标对象中。
     * @returns 目标对象后的所有对象中“target不包含”的属性都会继承到目标对象中。
     */
    improve<T, N>(deep: boolean, target: T, ...objectN: N[]): T & N;
    /**
     * 对象继承
     * @param target 目标对象。
     * @param object1 将此对象继承到目标对象中。
     * @param deep2 标识其后面对象是深度继承还是浅度继承。
     * @param objectN2 将此对象继承到目标对象中。
     * @returns 目标对象后的所有对象中“target不包含”的属性都会继承到目标对象中。
     */
    improve<T, U, N>(target: T, object1: U, deep2: boolean, ...objectN2: N[]): T & U & N;
    /**
     * 对象继承
     * @param deep 为 true 时深度继承。
     * @param target 目标对象。
     * @param object1 将此对象继承到目标对象中。
     * @param deep2 标识其后面对象是深度继承还是浅度继承。
     * @param objectN2 将此对象继承到目标对象中。
     * @returns 目标对象后的所有对象中“target不包含”的属性都会继承到目标对象中。
     */
    improve<T, U, N>(deep: boolean, target: T, object1: U, deep2: boolean, ...objectN2: N[]): T & U & N;
    /**
     * 合并数组
     * @param results 目标数组。
     * @param arr 内容将合并到目标数组中。
     */
    merge<T, U>(results: ArrayLike<T>, arr: ArrayLike<U>): Array<T | U>;
    /**
     * 数组遍历
     * @param array 需要遍历的数组。
     * @param callback 回调函数。
     */
    each<T>(array: ArrayLike<T>, callback: (this: T, elementOfArray: T, indexInArray: number) => any): T;
    /**
     * 数组遍历
     * @param array 回调函数。
     * @param callback 回调函数。
     * @param context 回调函数的上下文对象。
     */
    each<T>(array: ArrayLike<T>, callback: (elementOfArray: T, indexInArray: number) => any, context: any): T;
    /**
     * 对象遍历
     * @param object 需要遍历的对象。
     * @param callback 回调函数。
     */
    each<T, K extends keyof T>(object: T, callback: (this: T[K], valueOfProperty: T[K], propertyName: K, object) => any): T;
    /**
     * 对象遍历
     * @param object 需要遍历的对象。
     * @param callback 回调函数。
     * @param context 回调函数的上下文对象。
     */
    each<T, K extends keyof T>(object: T, callback: (valueOfProperty: T[K], propertyName: K, object) => any, context: any): T;
    /**
     * 数组映射。
     * @param array 需要映射的数组。
     * @param callback 回调函数。
     * @returns 映射结果数组。
     */
    map<T, TReturn>(array: ArrayLike<T>, callback: (this: T, elementOfArray: T, indexInArray: number) => TReturn | null | undefined): TReturn[];
    /**
     * 数组映射。
     * @param array 需要映射的数组。
     * @param callback 回调函数。
     * @returns 映射结果数组。
     */
    map<T, TReturn>(array: ArrayLike<T>, callback: (this: T, elementOfArray: T, indexInArray: number) => TReturn[] | null | undefined): TReturn[][];
    /**
     * 数组映射。
     * @param array 需要映射的数组。
     * @param callback 回调函数。
     * @param context 回调函数的上下文对象。
     * @returns 映射结果数组。
     */
    map<T, TReturn>(array: ArrayLike<T>, callback: (elementOfArray: T, indexInArray: number) => TReturn | null | undefined, context: any): TReturn[];
    /**
     * 数组映射。
     * @param array 需要映射的数组。
     * @param callback 回调函数。
     * @param context 回调函数的上下文对象。
     * @returns 映射结果数组。
     */
    map<T, TReturn>(array: ArrayLike<T>, callback: (elementOfArray: T, indexInArray: number) => TReturn[] | null | undefined, context: any): TReturn[][];
    /**
    * 对象映射。
    * @param array 需要映射的数组。
    * @param callback 回调函数。
    * @returns 映射结果数组。
    */
    map<T, TReturn, K extends keyof T>(object: T, callback: (this: T[K], valueOfProperty: T[K], propertyName: K) => TReturn | null | undefined): TReturn[];
    /**
    * 对象映射。
    * @param array 需要映射的数组。
    * @param callback 回调函数。
    * @returns 映射结果数组。
    */
    map<T, TReturn, K extends keyof T>(object: T, callback: (this: T[K], valueOfProperty: T, propertyName: K) => TReturn[] | null | undefined): TReturn[][];
    /**
    * 对象映射。
    * @param array 需要映射的数组。
    * @param callback 回调函数。
    * @param context 回调函数的上下文对象。
    * @returns 映射结果数组。
    */
    map<T, TReturn, K extends keyof T>(object: T, callback: (valueOfProperty: T, propertyName: K) => TReturn | null | undefined, context: any): TReturn[];
    /**
    * 对象映射。
    * @param array 需要映射的数组。
    * @param callback 回调函数。
    * @param context 回调函数的上下文对象。
    * @returns 映射结果数组。
    */
    map<T, TReturn, K extends keyof T>(object: T, callback: (valueOfProperty: T, propertyName: K) => TReturn[] | null | undefined, context: any): TReturn[][];
    /**
     * 判断数组中是否有元素满足回调函数逻辑。
     * @param array 数组。
     * @param callback 回调函数。
     * @returns 数组中任意一个元素使得回调函数返回 true 时，方法返回 true，否则 false。
     */
    any<T>(array: ArrayLike<T>, callback: (this: T, elementOfArray: T, indexInArray: number) => boolean): boolean;
    /**
     * 判断数组中是否有元素满足回调函数逻辑。
     * @param array 数组。
     * @param callback 回调函数。
     * @param context 回调函数上下文。
     * @returns 数组中任意一个元素使得回调函数返回 true 时，方法返回 true，否则 false。
     */
    any<T>(array: ArrayLike<T>, callback: (elementOfArray: T, indexInArray: number) => boolean, context: any): boolean;
    /**
     * 判断对象中是否有元素满足回调函数逻辑。
     * @param object 对象。
     * @param callback 回调函数。
     * @returns 数组中任意一个元素使得回调函数返回 true 时，方法返回 true，否则 false。
     */
    any<T, K extends keyof T>(object: T, callback: (this: T[K], valueOfProperty: T[K], propertyName: K) => boolean): boolean;
    /**
     * 判断对象中是否有元素满足回调函数逻辑。
     * @param object 对象。
     * @param callback 回调函数。
     * @param context 回调函数上下文。
     * @returns 数组中任意一个元素使得回调函数返回 true 时，方法返回 true，否则 false。
     */
    any<T, K extends keyof T>(object: T, callback: (valueOfProperty: T[K], propertyName: K) => boolean, context: any): boolean;
    /**
     * 异常。
     * @param message 异常信息。
     */
    error(message: string): any;
    /**
     * 语法异常。
     * @param message 异常信息。
     */
    syntaxError(message: string): any;
    /**
     * 删除字符串开头和结尾的空格。
     * @param string 字符串。
     */
    trim(string: string): string;
    /**
     * 将字符串中的大写字母转为“_”+“该字母的小写字符”。
     * @param string 字符串。
     * @example v2.urlCase("maxWidth"); // => "max-width";
     */
    urlCase(string: string): string;
    /**
     * 将字符串中“_”+“小写字母”转为改字母的大写字母。
     * @param string 字符串。
     * @example v2.camelCase("max-width"); // => "maxWidth"
     */
    camelCase(string: string): string;
    /**
     * 判断数字是否为（0|NAN）
     * @param number 需要判断的数字。
     */
    isEmpty(number: number): boolean;
    /**
     * 判断字符串是否为（null|空字符串）
     * @param string 需要判断的字符串。
     */
    isEmpty(string: string): boolean;
    /**
     * 判断数字是否为(null|空数组)
     * @param array 需要判断的数组。
     */
    isEmpty(array: ArrayLike<any>): boolean;
    /**
     * 判断对象是否为（null|undefined）。
     * @param object 需要判断的对象。
     */
    isEmpty(object: any): boolean;
    /**
     * 判断对象是不是 Window 对象。
     * @param object 需要判断的对象。
     */
    isWindow(object: any): object is Window;
    /**
     * 判断对象是不是数字。
     * @param object 需要判断的对象。
     */
    isNumber(object: any): object is Number;
    /**
     * 判断对象是不是字符串。
     * @param object 需要判断的对象。
     */
    isString(object: any): object is String;
    /**
     * 判断对象是不是函数。
     * @param object 需要判断的对象。
     */
    isFunction(object: any): object is Function;
    /**
     * 判断对象是不是空对象。
     * @param object 需要判断的对象。
     */
    isEmptyObject(object: any): boolean;
    /**
     * 判断对象是不是类数组。
     * @param object 需要判断的对象。
     */
    isArraylike(object: any): object is ArrayLike<any>;
    /**
     * 判断对象是不是数组。
     * @param object 需要判断的对象。
     */
    isArray(object: any): object is Array<any>;
    /**
     * 判断对象是不是常规数组。
     * @param object 需要判断的对象。
     */
    isPlainObject(object: any): boolean;
    /** 通配符，当对象的 key 第一个字符与 通配符的第一个字符相同，并且该 key 的值类型满足通配符的 type 值时，控件运行的时候会执行通配符的 exec 方法。*/
    wildCards: Yep.WildCards;
    /**
     * 控件准备。
     * @param tag 控件的tag名称。
     * @param callback 回调函数。
     * @returns 返回控件实例化对象。
     */
    ready(tag: string, callback: (tag: string) => any): Yep.V2Control;
    /**
     * 控件准备。
     * @param tag 控件的tag名称。
     * @param callback 回调函数。
     * @returns 返回控件实例化对象。
     */
    ready(tag: string, callback: (tag: string, option: Yep.PlainObject) => any): Yep.V2Control;
    /**
     * 将字符串按照空格分割，作为 A。
     * @param string 字符串。
     * @returns 返回方法。当调用方法的字符串包含在“A”中时，返回 true。
     */
    makeMap(string: string): (string: string) => boolean;
    /**
     * 将字符串按照空格分割，作为 A（当“expectsLowerCase”为true的时候把内容转为小写）。
     * @param string 字符串。
     * @param expectsLowerCase 指定字符串去不区分大小写。
     * @returns 返回方法。当调用方法的字符串(当“expectsLowerCase”为true的时候，将字符串转为小写)包含在“A”中时，返回 true。
     */
    makeMap(string: string, expectsLowerCase: boolean): (string: string) => boolean;
    /**
     * 生成缓存。
     * @param callback 回调函数。
     * @returns 当字符串没有缓存的时候，调用回调函数并将结果存为该字符串的缓存，否则直接返回字符串的缓存。
     */
    makeCache<T>(callback: (this: Yep.PlainObject<T>, string: string) => T): (string: string) => T;
    /**
     * 生成缓存。
     * @param callback 回调函数。
     * @param objectN 返回的函数参数。
     * @returns 当字符串没有缓存的时候，调用回调函数并将结果存为该字符串的缓存，否则直接返回字符串的缓存。
     */
    makeCache<T>(callback: (this: Yep.PlainObject<T>, string: string, ...objectN: any[]) => T): (string: string, ...objectN: any[]) => T;
    /**
     * 以命名空间的形式缓存(将option存到命名空间中)。
     * @param objectCreate 返回值构造器。
     * @param objectCallback 返回值新增属性函数。
     * @returns 设置命名空间数据或返回字符串命名空间的所有数据。
     */
    makeNamespaceCache<T>(objectCreate: (string: string) => ArrayLike<T>, objectCallback: (array: ArrayLike<T>, option: T, string: string) => any): (namespace: string, option?: T) => T;
    /**
     * 以命名空间的形式缓存。
     * @param objectCreate 返回值构造器。
     * @param objectCallback 返回值新增属性函数。
     * @returns 设置命名空间数据或返回字符串命名空间的所有数据。
     */
    makeNamespaceCache<T>(objectCreate: (string: string) => Yep.PlainObject<T>, objectCallback: (object: Yep.PlainObject<T>, option: T, string: string) => any): (namespace: string, option?: T) => T;
    /**
     * 判断当前对象的nodeName是否与tag相同（当tag为空或者为“*”时，对象满足Node对象就返回true），不区分大小写。
     * @param node node对象。
     * @param tag nodeName名称。
     */
    nodeName(node: Node, tag: string): boolean;
    /**
     * 获取已设置tag控件的所有配置内容。
     * @param tag tag名称。
     * @returns 返回tag控件的所有配置内容。
     */
    use(tag: string): Array<Yep.PlainObject>;
    /**
     * 设置控件的全局属性或方法。
     * @param option 需要设置的对象。
     */
    use(option: Yep.UsePlainObject): any;
    /**
     * 设置tag控件的配置。
     * @param tag tag名称。
     * @param option 需要设置的对象。
     */
    use(tag: string, option: Yep.UsePlainObject): any;
    /**
     * 类型集水池
     * @param typeCb 集水池。
     * @param type 类型（集水池中的值或集水池中多个值的和）
     * @param callback 回调函数（当 (type&typeCb[key])==typeCb[key]时调用）。
     */
    typeCb(typeCb: Yep.PlainObject<number>, type: number, callback: (propertyName: string, valueOfProperty: number) => any): any;
    /**
     * 日志（调用 console.log 方法打印消息）。
     * @param message 消息内容。
     */
    log(message: string): any;
    /**
     * 日志(调用第一个满足type并且类型包含在console中的函数)。
     * @param message 错误信息。
     * @param type 类型(值：[1,31])。
     */
    log(message: string, type: number): any;
    /**
     * 日志(调用第一个所有type并且类型包含在console中的函数)。
     * @param message 错误信息。
     * @param type 类型(值：[1,31])。
     */
    log(message: string, type: number, logAll: true): any;
}

/** DOM */
interface V2kitStatic {
    /** 属性修复 */
    propFix: Yep.PlainObject<string>,
    /** css 钩子 */
    cssHooks: Yep.Hooks,
    /** 是否支持数字型 */
    cssNumber: Yep.PlainObject<boolean>,
    /** css 属性 */
    cssProps: Yep.PlainObject<string>,
    /**
     * item 是不是 main 的子孙节点
     * @param main 主元素
     * @param item 子元素
     */
    contains(main: Element, item: Element): boolean,
    /**
     * 绑定事件
     * @param elem 元素
     * @param types 事件类型（多个时以空格分割）
     * @param fn 事件
     * @param selector 作用子元素的选择器
     */
    on(elem: Element, types: string, fn: Function, selector?: string): any,
    /**
     * 解绑事件
     * @param elem 元素
     * @param types 事件类型（多个时以空格分割）
     * @param fn 事件
     * @param selector 作用子元素的选择器
     */
    off(elem: Element, types: string, fn: Function, selector?: string): any,
    /**
     * 添加类名
     * @param elem 元素
     * @param value 类名（多个时以空格分割）
     */
    addClass(elem: Element, value: string): any,
    /**
     * 移除类名
     * @param elem 元素
     * @param value 类名（多个时以空格分割）
     */
    removeClass(elem: Element, value: string): any,
    /**
     * 是否包含类名
     * @param elem 元素
     * @param value 类名
     * @returns true表示包含，否则，不包含。
     */
    hasClass(elem: Element, value: string): boolean,
    /**
     * 如果元素包含名为“value”的类名，则移除该类名，否则添加该类名。
     * @param elem 元素
     * @param value 类名
     */
    toggleClass(elem: Element, value: string): V2Control,
    /**
     * 如果“toggle”为true，向元素添加类名“value”，否则移除类名“value”。
     * @param elem 元素
     * @param value 类名
     * @param toggle 开关
     */
    toggleClass(elem: Element, value: string, toggle: boolean): V2Control,
    /**
     * 获取指定属性名称的属性值
     * @param elem 元素
     * @param name 属性名称
     */
    attr(elem: Element, name: string): string,
    /**
     * 获取指定属性名称的属性值集合
     * @param elem 元素
     * @param name 属性名称集合
     */
    attr(elem: Element, name: Array<string>): Yep.PlainObject<string>,
    /**
     * 设置指定属性名称的属性值集合
     * @param elem 元素
     * @param name 属性名称集合
     */
    attr(elem: Element, name: Yep.PlainObject): any,
    /**
     * 设置指定属性名称的属性值集合
     * @param elem 元素
     * @param name 属性名称
     * @param value 属性值
     */
    attr(elem: Element, name: string, value: any): any,
    /**
     * 移除指定名称的属性
     * @param elem 元素
     * @param value 属性名称（多个以空格区分）
     */
    removeAttr(elem: Element, value: string): any,
    /**
     * 获取指定属性名称的属性值
     * @param elem 元素
     * @param name 属性名称
     */
    prop(elem: Element, name: string): string,
    /**
     * 获取指定属性名称的属性值集合
     * @param elem 元素
     * @param name 属性名称集合
     */
    prop(elem: Element, name: Array<string>): Yep.PlainObject<string>,
    /**
     * 设置指定属性名称的属性值集合
     * @param elem 元素
     * @param name 属性名称集合
     */
    prop(elem: Element, name: Yep.PlainObject): any,
    /**
     * 设置指定属性名称的属性值集合
     * @param elem 元素
     * @param name 属性名称
     * @param value 属性值
     */
    prop(elem: Element, name: string, value: any): any,
    /**
     * 移除指定名称的属性
     * @param elem 元素
     * @param value 属性名称（多个以空格区分）
     */
    removeProp(elem: Element, value: string): any,
    /**
     * 交换（交换后调用回调函数，执行回调函数后恢复元素属性到交换前状态）
     * @param elem 元素
     * @param options 元素属性配置
     * @param callback 回调函数
     * @param args 回调函数参数
     * @returns 回调函数返回值
     */
    swap(elem: Element, options: Yep.PlainObject<string>, callback: Function, args?: Array<any>): any,
    /**
     * 获取style指定属性名称的值
     * @param elem 元素
     * @param name 属性名称
     */
    style(elem: Element, name: string): string,
    /**
     * 设置style指定属性名称的值
     * @param elem 元素
     * @param name 属性名称
     * @param value 属性值
     * @param extra 尝试转为数字
     */
    style(elem: Element, name: string, value: any, extra?: any): any,
    /**
     * 获取指定属性名称的值
     * @param elem 元素
     * @param name 属性名称
     * @param extra 尝试转为数字
     */
    css(elem: Element, name: string, extra?: any),
    /**
     * DOM操作
     * @param elem 元素
     * @param args 参数
     * @param table 表格修复
     * @param callback 回调函数
     */
    domManip(elem: Element, args: Array<number | string | Element>, table: boolean, callback: Function): any,
    /**
    * 向元素追加子元素
    * @param elem 元素
    * @param args 元素集合
    */
    append(elem: Element, args: Array<number | string | Element>): any,
    /**
     * 向元素首部插入子元素
     * @param elem 元素
     * @param args 元素集合
     */
    prepend(elem: Element, args: Array<number | string | Element>): any,
    /**
     * 在元素之前插入元素
     * @param elem 元素
     * @param args 元素集合
     */
    before(elem: Element, args: Array<number | string | Element>): any,
    /**
     * 在元素之后插入元素
     * @param elem 元素
     * @param args 元素集合
     */
    after(elem: Element, args: Array<number | string | Element>): any,
    /**
     * 替换元素
     * @param elem 被替换的元素
     * @param value 生成用来替换元素的内容
     */
    replaceWith(elem: Element, value: Element | string | number): any,
    /**
     * 清空指定元素所有子节点
     * @param elem 元素
     */
    empty(elem: Element): any,
    /**
     * html 序列化
     * @param html 序列化内容
     */
    htmlSerialize(html: Yep.htmlString): string
}