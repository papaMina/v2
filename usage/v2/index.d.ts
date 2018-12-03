declare namespace VBtonsoft {
    /** 控件基类(承载主控被重写之前的方法) */
    interface V2ControlBase {
        /** 基础 */
        readonly base: V2ControlBase,
        /**
         * 初始化控件
         * @param tag tag名称
         * @param option 控制器入参。
         */
        init(tag: string, option: PlainObject): any,
        /**
         * 渲染控件
         * @param variable 入参变量
         */
        render(variable: PlainObject): any
    }
    /** 控件 */
    interface V2Control extends V2ControlBase {
        /** 版本号 */
        readonly v2: string,
        /** tag名称 */
        readonly tag: string,
        /** 类名空间 */
        readonly namespace: string,
        /** 是否准备完成 */
        readonly isReady: boolean,
        /** 入参变量(入参) */
        readonly variable: PlainObject,
        /**  */
        limit: boolean,
        /** 是否加载控件的时候加载数据 */
        access: boolean,
        /** 主元素 */
        $: Node,
        /** 主元素所在的元素 */
        $$: Node,
        /** 控件状态枚举。控件运行时依照对象值重小到大依次调用方法(值在2-4之间（不包含2和4）时，将当前控件的入参变量注入调用的方法) */
        enumState: PlainObject<number>,
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
    /**通配符  */
    interface WildCard {
        /** 类型（多个时以“|”分割） */
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
}

declare const v2kit: V2kitStatic;
declare const v2: V2kitStatic;