declare namespace Yep {
    /** 控件基类(承载主控被重写之前的方法) */
    interface V2ControlBase {
        /** 基础 */
        readonly base: V2ControlBase,
        /**
         * 初始化控件（查询或 生产主元素）
         * @param tag 控件元素TAG，默认：div
         */
        init(tag?: string): any,
        /**
         * 渲染控件
         * @param variable 入参变量
         */
        render(variable: PlainObject): any,
        /** 取数（无论同步还是异步，控件都将在取数完成后自动继续渲染控件） */
        ajax(): any,
        /** 解决(生成控件内容，处理控件复杂逻辑) */
        resolve(): any,
        /** 完成提交（绑定事件） */
        commit(): any,
        /** 显示控件 */
        show(): any,
        /** 隐藏控件 */
        hide(): any,
        /** 反转当前控件显示/隐藏状态 */
        toggle(): any,
        /**
         * 隐藏或显示控件
         * @param toggle 为true时显示控件，否则隐藏控件
         */
        toggle(toggle: boolean): any,
        /**
         * 隐藏或显示控件
         * @param visible 为true时显示控件，否则隐藏控件
         */
        visible(visible: boolean): any,
        /**
         * 启用或禁用当前控件
         * @param disabled 为true时禁用，否则启用
         */
        disabled(disabled: boolean): any,

        /**
         * 提取元素
         * @param selector 元素选择器
         * @param context 提取元素选择器的范围对象。
         */
        take(selector: string, context?: Node): Node,
        /**
         * 提取元素
         * @param selector 元素选择器
         * @param context 提取元素选择器的范围对象。
         */
        take(selector: Node, context?: Node): Node,
        /**
         * 基础配置初始化。
         * @param option 基础配置入参。
         */
        baseConfigs(option: PlainObject): any,
        /** 构件控件 */
        build(): any,
        /**
         * 执行方法
         * @param callback 回调函数
         * @param args 回调函数参数
         */
        invoke(callback: string, ...args: any): any,
        /**
         * 执行控件中名称为“callback”的方法
         * @param callback 回调函数
         * @param args 回调函数参数
         */
        invoke(callback: string, ...args: any): any,
        /** 使控件获取焦点 */
        focus(): any,
        /**
        * 控件主元素是否包含名为“value”的类名
        * @param value 类名
        * @returns 是否包含类名。
        */
        hasClass(value: string): boolean,
        /**
         * 添加类名
         * @param value 类名
         */
        addClass(value: string): V2Control,
        /**
         * 移除类名
         * @param value 类名(多个时，用空格分开)
         */
        removeClass(value: string): V2Control,
        /**
         * 如果主元素包含名为“value”的类名，则移除该类名，否则添加该类名。
         * @param value 类名
         */
        toggleClass(value: string): V2Control,
        /**
         * 如果“toggle”为true，向主元素添加类名“value”，否则移除类名“value”。
         * @param value 类名
         * @param toggle 开关
         */
        toggleClass(value: string, toggle: boolean): V2Control,
        /**
         * 获取style属性值
         * @param name style属性名称
         */
        css(name: string): number | string,
        /**
         * 获取style属性值
         * @param name style属性名称数组集合
         */
        css(name: Array<string>): PlainObject,
        /**
         * 设置style属性值
         * @param name style属性名称和属性值对象
         */
        css(name: PlainObject): V2Control,
        /**
         * 设置style属性值
         * @param name 属性名称
         * @param value 属性值
         */
        css(name: string, value: any): V2Control,
        /**
         * 获取属性值
         * @param name 属性名称
         */
        attr(name: string): any,
        /**
         * 获取属性值
         * @param name 属性名称数组
         */
        attr(name: Array<string>): PlainObject,
        /**
         * 设置属性值
         * @param name 包含属性名称和属性值的对象
         */
        attr(name: PlainObject): V2Control,
        /**
         * 设置属性值
         * @param name 属性名称
         * @param value 属性值
         */
        attr(name: string, value: string): V2Control,
        /**
         * 移除属性
         * @param value 属性名称(多个时，用空格分开)
         */
        removeAttr(value: string): V2Control,
        /**
         * 获取属性值
         * @param name 属性名称
         */
        prop(name: string): any,
        /**
         * 获取属性值
         * @param name 属性名称数组
         */
        prop(name: Array<string>): PlainObject,
        /**
         * 设置属性值
         * @param name 包含属性名称和属性值的对象
         */
        prop(name: PlainObject): V2Control,
        /**
         * 设置属性值
         * @param name 属性名称
         * @param value 属性值
         */
        prop(name: string, value: string): V2Control,
        /**
         * 移除属性
         * @param value 属性名称(多个时，用空格分开)
         */
        removeProp(value: string): V2Control,
        /**
         * 设置控件宽度
         * @param width 宽度
         * @returns 是否设置成功
         */
        width(width: number): boolean,
        /**
         * 设置控件宽度
         * @param width 宽度([+-/*]?\d+.\d+(px|%|))
         * @returns 是否设置成功
         */
        width(width: string): boolean,
        /**
         * 设置控件高度
         * @param width 高度
         * @returns 是否设置成功
         */
        height(width: number): boolean,
        /**
         * 设置控件高度
         * @param width 高度([+-/*]?\d+.\d+(px|%|))
         * @returns 是否设置成功
         */
        height(width: string): boolean,
        /**
         * 绑定事件
         * @param type 事件类型（不加“on”前缀，多个时用空格分开）
         * @param fn 事件回调函数
         */
        on(type, fn): V2Control,
        /**
         * 绑定事件
         * @param type 事件类型（不加“on”前缀，多个时用空格分开）
         * @param selector 控件作用的子元素选择器
         * @param fn 事件回调函数
         */
        on(type, selector, fn): V2Control,
        /**
         * 解绑事件
         * @param type 事件类型（不加“on”前缀，多个时用空格分开）
         * @param fn 事件回调函数
         */
        off(type, fn): V2Control,
        /**
         * 解绑事件
         * @param type 事件类型（不加“on”前缀，多个时用空格分开）
         * @param selector 控件作用的子元素选择器
         * @param fn 事件回调函数
         */
        off(type, selector, fn): V2Control,
        /**
         * 向主元素追加子元素
         * @param args 元素集合
         */
        append(...args: Array<number | string | Element>): V2Control,
        /**
         * 向主元素首部插入子元素
         * @param args 元素集合
         */
        prepend(...args: Array<number | string | Element>): V2Control,
        /**
         * 在主元素之前插入元素
         * @param args 元素集合
         */
        before(...args: Array<number | string | Element>): V2Control,
        /**
         * 在主元素之后插入元素
         * @param args 元素集合
         */
        after(...args: Array<number | string | Element>): V2Control,
        /** 移除主元素所有子节点 */
        empty(): V2Control,
        /**
         * 按照状态持续构建插件。
         * @param state 状态，不传的时候取控件当前状态。
         * @param falseStop 状态对应方法返回 false 时，是否终止执行。
         */
        whenThen(state?: number, falseStop?: true): any,
        /**
         * 释放插件。
         * @param deep 是否深度释放插件。深度释放时，插件内属性以及属性对象包含的属性都会被释放。
         */
        destroy(deep?: boolean): any
    }
    /** 控件 */
    interface V2Control extends V2ControlBase {
        /** 版本号 */
        readonly v2: string,
        /** tag名称 */
        readonly tag: string,
        /** 类名空间 */
        readonly namespace: string,
        /** 是否准备完成（默认：false） */
        readonly isReady: boolean,
        /** 入参变量(入参) */
        readonly variable: PlainObject,
        /** 为真时采用“max-width”和“max-height”限制控件大小，否则采用“width”和“height”限制控件大小. 默认：false*/
        limit: boolean,
        /** 是否加载控件的时候加载数据，为真并且存在“ajax”方法时，在“render”方法完成后自动调用“ajax”方法并等待数据加载完成后继续渲染控件，否则控件直接渲染完成。默认：false */
        access: boolean,
        /** 主元素 */
        $: Node,
        /** 主元素的父元素 */
        $$: Node,
        /** 控件状态枚举。控件运行时依照对象值重小到大依次调用方法(值在2-4之间（不包含2和4）时，将当前控件的入参变量注入调用的方法) 
         * 默认：{
            pending: 0.5, // 准备
            init: 1, // 初始化（查询或生产主元素）
            render: 2, // 渲染控件
            resolve: 4, // 生产控件（处理控件复杂逻辑）
            commit: 8 // 完成提交（绑定事件）
        * }
        */
        enumState: PlainObject<number>        
    }
    /**通配符  */
    interface WildCard {
        /** 类型（多个时以“|”分割,任意类型时用“*”） */
        type: string,
        /**
         * 满足类型时的执行方法
         * @param control 控件
         * @param value 满足当前控制器的属性值（type为“function”时，返回控件的key属性值，否则返回控件“入参变量”的key属性值）。
         * @param key 满足当前控制器的属性名称。
         */
        exec(control: V2Control, value: any, key: any): any;
    }
    /** 通配符集合 */
    interface WildCards {
        [key: string]: WildCard
    }
    /** 普通对象 */
    interface PlainObject<T = any> {
        [key: string]: T;
    }
    /** 插件对象 */
    interface UsePlainObject extends Yep.V2Control {
        [key: string]: any;
    }
}

declare const v2kit: V2kitStatic;
declare const v2: V2kitStatic;