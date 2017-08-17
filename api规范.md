# 正常响应

本节为您提供请求正常时，返回的信息。

- 如果返回的数据为 JSON 格式，则需要在响应头部分添加信息：
  - Content-Type: application/json

且返回信息格式为

``` js
{
    "code": 200,
    "response": <response any>
}
```

- 如果返回的数据是文本、图片等非 JSON 格式的数据，需要在响应头添加正确的 Content-Type，下面的链接可以查看常用的 Media Types
    - [所有 Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml)
    - [常用 HTTP Content-Type 对照表](http://tool.oschina.net/commons)


# 错误响应

本节为您提供请求出现错误时，返回的错误码和对应的错误信息。

## 错误响应格式
当您请求出现错误时，响应头部信息包括：

- Content-Type: application/json
- 一个合适的 3xx，4xx，或者 5xx 的 HTTP 状态码

各个接口在遇到执行错误时，将返回一个 JSON 格式组织的信息对象，描述出错原因。具体格式如下：

``` js
{
    "code": <httpCode int>,
    "error": "<errMsg string>"
}
```

| 字段名称 | 说明 |
| :-----: | --- |
| code    | 返回的错误码，用来定位错误场景 |
| error   | 包含详细的错误信息 |

## 错误码列表
以下表格列出了常见错误码：（需要增加请自行维护此文档）

| HTTP状态码 | 说明 |
| :--------:| --- |
| 400       | 请求报文格式错误，包括上传时，上传表单格式错误 |
| 401       | 认证授权失败，认证超时等等 |
| 403       | 拒绝访问，防盗链屏蔽的结果 |
| 404       | 资源不存在 |
| 405       | 请求方式错误（例如一个 POST 请求，前端却发送了 GET 请求） |
| 419       | 用户账号被冻结 |
| 502       | 错误网关 |
| 503       | 服务端不可用 |
| 504       | 服务端操作超时 |
| 599       | 服务端操作失败 |


# 两项原则

本节为您提供 API RESPONSE 中需要遵循的两项原则

1. response 中的数据格式在任何情况下需要保持一致，

``` js
{
  "code": 200,
  "response": [{"id": 1}, {"id": 2}]
}

// response 中的数据只有 1 条时仍然要保证数据类型为数组
{
  "code": 200,
  "response": [{"id": 1}]
}
```

2. response 中的格式不要使用字符串格式（除了只能用字符串表示的数据）

``` js
// 错误示例
{
    "code": 200,
    "response": "{\"id\": 1}"
}

// 正确示例
{
    "code": 200,
    "response": {"id": 1} 
}

// 正确示例
{
    "code": 200,
    "response": "这样也是合法的，因为我只能是字符串"
}
```


