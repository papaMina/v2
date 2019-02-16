declare namespace Yep {
    interface UriBase {
        /**
         * 获取指定参数
         * @param name 参数名称
         * @param same 获取参数内容原型（默认会根据内容格式进行尝试解析，设置true时总是返回字符串）
         */
        take(name, same): any,
        /**
         * 分析url地址
         * @param url 地址
         */
        init(url: string): any,
        /**
         * 在当前url地址上，增加参数，并返回新的url地址
         * @param object 参数对象
         */
        toQueryString(object: PlainObject): string,
        /** 返回当前对象地址 */
        toString(): string
    }
    interface Uri extends UriBase {
        /** 网址 */
        readonly href: string,
        /** 原点 */
        readonly origin: string,
        /** 协议 */
        readonly protocol: string,
        /** 主机地址 */
        readonly host: string,
        /** 主机名称 */
        readonly hostname: string,
        /** 端口号 */
        readonly port: string,
        /** 路径名称 */
        readonly pathname: string,
        /** 路径 */
        readonly path: string,
        /** 文件 */
        readonly file: string,
        /** 文件名 */
        readonly filename: string,
        /** 文件后缀 */
        readonly extension: string,
        /** 参数 */
        readonly search: string,
        /** 哈希地址 */
        readonly hash: string
    }
    interface UriStatic {
        (url: string): Uri,
        fn: UriBase
    }

    interface DateStatic {
        /**
         * 将对象转为日期
         * @param date 数据无效时取当前日期
         */
        (date?: Date | number | string): Date,
        /** 判断当前年份是不是闰年 */
        isLeapYear(): boolean,
        /**
         * 判断是不是闰年
         * @param year 年份
         */
        isLeapYear(year: number): boolean,
        /**
         * 获取指定日期是多少号
         * @param date 数据无效时取当前日期
         */
        day(date: Date | number | string): number,
        /**
         * 获取指定日期是星期几
         * @param date 数据无效时取当前日期
         */
        dayWeek(date: Date | number | string): number,
        /**
         * 获取指定日期是一年中的第几天
         * @param date 数据无效时取当前日期
         */
        dayYear(date: Date | number | string): number,
        /**
         * 获取指定日期的月份中有多少天
         * @param date 日期
         */
        dayCount(date: Date): number
        /**
         * 获取指定年份的指定月份中有多少天
         * @param year 年份
         * @param month 月份
         */
        dayCount(year: number, month: number): number,
        /**
         * 获取当前日期是当月的第几周
         * @param date 数据无效时取当前日期
         */
        week(date: Date | number | string): number,
        /**
         * 获取指定日期是一年中的第几周
         * @param date 数据无效时取当前日期
         */
        weekYear(date: Date | number | string): number,
        /**
         * 获取指定日期的月份
         * @param date 数据无效时取当前日期
         */
        month(date: Date | number | string): number,
        /**
         * 获取指定日期的年份
         * @param date 数据无效时取当前日期
         */
        year(date: Date | number | string): number,
        /**
         * 格式化日期【y,M,d,H,h,m,s,f】
         * @param date 数据无效时取当前日期
         * @param fmt 格式化字符串（默认：“yyyy-MM-dd”）
         */
        format(date: Date | number | string, fmt?: string): string
    }
}
interface V2kitStatic {
    /**
     * 对象转为字符串
     * @param object 对象
     * @param eq 属性名称和属性值的拼接符
     * @param spl 多个属性键值对的拼接符
     */
    toQueryString(object: Yep.PlainObject, eq?: string, spl?: string): string,
    /** 地址分析 */
    uri: Yep.UriStatic,
    /**
     * 判断对象是不是日期型
     * @param date 对象
     */
    isDate(date: any): boolean,
    /**
     * 将对象转为日期
     * @param date 对象
     */
    date: Yep.DateStatic
}