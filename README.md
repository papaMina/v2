# v2 使用说明


1. 多个参数。
---
    String.format(...args)
----
> 
>> 例如：
>> ``` javascript
>>	var string = "{0}是一个实用的{1}，包含很多有趣的功能。".format("v2", "前端轻量级框架");
>>	console.log(string); // => v2是一个实用的前端轻量级框架，包含很多有趣的功能。
>> ```
>
> 说明：
> 用法`{N}`[^1]的方式嵌入字符串中。


2. 单个参数。
---
    String.format([...args]); 或  String.format(arg);
---
* 2.1 参数是数组的情况。
>
>> 例如：
>> ``` javascript
>>	var string = "{0}是一个实用的{1}，包含很多有趣的功能。".format(["v2", "前端轻量级框架"]);
>>	console.log(string); // => v2是一个实用的前端轻量级框架，包含很多有趣的功能。
>> ```
>
> 说明：用法`{N}`[^2]的方式嵌入字符串中。

* 2.2 其它。
> 
>> 例如：
>> ``` javascript
>>	var string = "我是一名{0}。".format("前端工程师");
>>	console.log(string); // => 我是一名前端工程师。
>> ```
>
> 说明：
> 用法`{N}`[^1]的方式嵌入字符串中。

> ##### 问：参数可以是其它数据类型么？
>> 答：参数可以是任意类型，数据类型会被该数据类型的`toString`方法转为字符串在与格式化的字符串拼合。

# 格式化字符串（二）
> #### 直接使用字符串“.”方法的方式格式化字符串。
>> 加强了字符串原有的`replace`，也就是说，字符串的原有原生方法，用法不变。

---
    String.replace({JSON},|Boolean|?)
----

1. 入门用法。
> 
>> 例如：
>> ``` javascript
>>	var string = "{name}是一个实用的{type}，包含很多有趣的功能。".replace({ name: "v2", type: "前端轻量级框架" });
>>	console.log(string); // => v2是一个实用的前端轻量级框架，包含很多有趣的功能。
>> ```
>
> 说明：
> 用法`{Naming}`[^3]的方式嵌入字符串中。
> 

2. 初级用法。
> 
>> 例如：
>> ``` javascript
>>	var string = "{name.v2}是一个实用的{type.slice(2)}，包含很多有趣的功能。".replace({ name: { v2: "v2", vue: "vue" }, type: "前端轻量级框架" });
>>	console.log(string); // => v2是一个实用的轻量级框架，包含很多有趣的功能。
>> ```
>
> 说明：
> 用法`{Naming.[Naming|Function]}`[^4]的方式嵌入字符串中。

3. 中级用法。
> 
>> 例如：
>> ``` javascript
>>	var string = "{name.v2 + \"和\" + name.vue}都是实用的{type.slice(2)}，包含很多有趣的功能。".replace({ name: { v2: "v2", vue: "vue" }, type: "前端轻量级框架" });
>>	console.log(string); // => v2和vue都是实用的轻量级框架，包含很多有趣的功能。
>> ```
> 
> 说明：
> 用法`{Naming.[Naming|Function] [*^<%>+/-] + Naming.[Naming|Function]}`[^5]的方式嵌入字符串中。

4. 高级用法。
> 
>> 例如：
>> ``` javascript
>>	var string = "{name.v2 + \"和\" + name.vue}都是{level?.very}实用的{type.slice(2)}，包含很多有趣的功能。".replace({ name: { v2: "v2", vue: "vue" }, level: { very: "【非常】" }, type: "前端轻量级框架" });
>>	console.log(string); // => v2和vue都是【非常】实用的轻量级框架，包含很多有趣的功能。
>>
>>	var string = "{name.v2 + \"和\" + name.vue}都是{level?.very}实用的{type.slice(2)}，包含很多有趣的功能。".replace({ name: { v2: "v2", vue: "vue" }, type: "前端轻量级框架" });
>>	console.log(string); // => v2和vue都是实用的轻量级框架，包含很多有趣的功能。
>> ```
>
> 说明：
> 用法`{Naming?.[Naming|Function]}`[^6]的方式嵌入字符串中。

5. 进价级用法。
> 
>> 例如：
>> ``` javascript
>>	var string = "{.?.name}是一个优秀的前端框架？".replace(null);
>>	console.log(string); // => 是一个优秀的前端框架？
>> ```
>
> 说明：
> 用法`{.?.Naming]}`[^7]的方式嵌入字符串中。
> 均可与以上四种方式排列组合执行。


> 参考代码：[Github](https://github.com/vbton/v2 "v2")

[^1]:`N`代表第`N`个参数，参数从`0`开始计算。
[^2]:`N`代表数组参数的元素坐标。
[^3]:`{Naming}`代表`JSON`的属性名称，替换的时候将会把`JSON`属性名称对应的值替换到字符串中。
[^4]:`{Naming.[Naming|Function]}` 代表可以获取`JSON`的属性值的属性值，以及调用属性值的方法（可以有多层，如：{a.b.c().d.e()}）。
[^5]:`{Naming.[Naming|Function] [*^<%>+/-] Naming.[Naming|Function]}` 代表多个值之间可以进行加、减、乘、除等运算（可以有多层，如：{a + b - c ^ d  / e}）。
[^6]:`{Naming?.[Naming|Function]}` 可以加入探测符，在该值空（`null`）的时候，终止运算，用于规避预料之内的异常（可以有多层，如：{a.b?.c()?.d.e()}）。
[^7]:`{.?.Naming]}` 本体探测，即对`JSON`本身进行空值（`null`）探测。注：第一个字符为`.`代表`JSON`对象本身。