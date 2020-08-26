在上一篇文章中, 通过学习 G schema 和在执行`query`和`mutation`时的基础角色，我们涵盖了很多有关于 G 的内部机制

虽然我们现在知道 G server 是如何利用 G engine 来执行这些操作的，但是我们还没有涉及到实际的客户端-服务端之间的通讯： 请求和响应的数据是如何在网络中被传输的。 这正是这篇文章将讲的

Graphql 服务能够用任何你青睐的语言实现,在这篇文章中我们将聚焦于 JavaScript 和用来帮助你构建服务的库，主要有 express-graphql, apollo-server and graphql-yoga.

## 在 http 上搭建 G 服务

### G 无关于传输层

一个我们需要知道的是，G 完全不涉及到数据如何在网络中的传输，这意味着 G 服务也可以使用`HTTP`以外的协议，比如`websocket`,`tcp`. 不过在这里我们只关注于最常使用的`HTTP`。

### Express.js 被用作强大且灵活的基础

> 下面的部分主要是关于`Express.js`和用来使用 G 的中间件(像`express-graphql`和`apollo-server`)。如果你已经熟悉`Express`，你可以跳过这一部分

`express.js`是到目前为止最流行的 JS 框架，它的简单性，灵活性和性能使其光芒四射。

所有你需要用来开始搭建 web 服务的代码就像下面:

```js
const express = require("express")
const app = express()

// respond with "hello world" when a GET request is received
app.get("/", function(req, res) {
  res.send("<h1>Hello World</h1>")
})
app.listen(3000)
```

在用`node.js`执行该脚本后，你可以在浏览器中访问http://localhost:3000

你可以简单的给你的服务 API 添加更多的端口(也称路由)

```js
app.get("/goodbye", function(req, res) {
  res.send("<h1>Goodbye</h1>")
})
```

或者使用其它的 HTTP 方法,例如用 POST 而不是 GET
Or use another HTTP method, for example POST instead of GET:

```js
app.post("/", function(req, res) {
  res.send("<h1>You just made a POST request</h1>")
})
```

Express 提供了非常大的灵活性,使用中间件的概念可以让你很简单的添加功能

Express 中灵活性和模块化的关键：中间件(Middleware)
中间件允许在请求处理时或在响应返回之前，拦截传入的请求并执行专门的任务。

本质上，中间件不过只是一个带三个参数的函数：
req: 从客户端传入的请求
res: 返回给客户端的响应
next: 调用下一个中间件的函数

由于中间件函数可以访问的请求和返回的响应，因此这是一个非常强大的概念，我们可以按特定的需求去改造这些请求和响应
中间件可以在很多情况里使用，例如鉴权、缓存、数据转化、校验以及自定义业务逻辑等等。这里有一个简单的例子：记录请求接收时间的日志

```js
function loggingMiddleware(req, res, next) {
  console.log(`Received a request at: ${Date.now()}`)
  next()
}
app.use(loggingMiddleware)
```

中间件带来的灵活性被 `graphql-express`, `apollo-server` or `graphql-yoga`这些基于`Express`的框架所利用

### Express & GraphQL

加上在上篇文章中我们已经学习到的关于 G 函数 和 G 执行引擎，我想我们已经可以猜到基于`Express`的 G 服务是如何工作的

Express 提供了处理 HTTP 请求所需的一切，而 GraphQL.js 提供了解决`query`的功能，现在我们只要一个可以粘合它们的东西。

这个粘合剂就是由像 `express-graphql` and `apollo-server`这些仅仅是一个函数的中间件的库

apollo-server: `express`之外更好兼容性的生态系统。  
按它的本质来说,AS 非常类似于 EG ，但有一些小不同。其中最主要的区别是 AS 允许集成其他的框架，像`koa`, `hapi`以及 AWS 和 Azure 之类的云函数。添加对应后缀就是我们要的各种集成的包名。e.g. apollo-server-express, apollo-server-koa 或 apollo-server-lambda.

然后，从核心上它也是一个将 HTTP 层与 G 引擎桥接起来的中间件。这里是用`apollo-server-express`实现像上面`express-graphql`的例子

```js
const express = require("express")
const bodyParser = require("body-parser")
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express")
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql")

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: (root, args, context, info) => {
          return "Hello World"
        },
      },
    },
  }),
})

const app = express()

app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }))
app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })) // enable GraphiQL

app.listen(4000)
```

### graphql-yoga: 搭建 G 服务 最简单的方式

消除搭建 G 服务的阻碍
即使当我们使用 `express-graphql` or `apollo-server`,仍然存在一些阻碍点：

- 要求安装多个依赖
- 需要先学会 Express
- GraphQL 订阅的复杂设置

这些阻碍点都被`graphql-yoga`所移除。它本质上是一个在`Express`,`apollo-server`及一些其他库之上提供一个快速创建 G 服务的便捷层

这里是同上面`express-graphql` , `apollo-server`一样的 G 服务

```js
const { GraphQLServer } = require("graphql-yoga")

const typeDefs = `
  type Query {
    hello: String!
  }
`

const resolvers = {
  Query: {
    hello: (root, args, context, info) => "Hello  World",
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start() // defaults to port 4000
```

注意这个`GraphQLServer`能直接传入已有的`GraphQLSchema`实例来实例化，也可以像上面的代码中那样，通过一个方便的接口实现(基于 graphql-tools 中的`makeExecutableSchema`)

### 内建支持 G Playgrounds, Subscriptions & Tracing

GraphQL -yoga 还为 GraphQL 订阅提供了一个开箱即用的简单 API，它构建在 GraphQL 订阅和 ws-subscriptions-transport 包之上。在这个简单的示例中，您可以查看它是如何工作的。

为了到达能在 G 与`graphql-yoga`执行时有字段等级的分析,它内建同样支持 Apollo 追踪

## 总结

在上篇文章里 我们讨论了基于`GraphQLSchema` G 的执行过程和 G 引擎的概念。这次我们关注于网络层，G 服务 是如何通过解析`query`(或`mutation`)响应 HTTP 请求的  
在 Node 的生态里, Express 由于其简单灵魂是目前最受欢迎的 web 服务端框架,因为此最常见的 G 服务的实现也是基于 Express,其中最著名的两个是`express-graphql`和`apollo-server`。这两个库大同小异，最重要的一点是 `apollo-server`同样兼容像`koa`和`hapi`等其他的 web 框架  
`graphql-yoga` 是在其他的库上面建立的便捷的一层，它是构建 G 服务最简单的方式  
在下篇文章中，我们将讨论在 G `resolver`中传递的 `info`参数的内部结构
