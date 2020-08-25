在上一篇文章中, 通过学习 G schema 和在执行`query`和`mutation`时的基础角色，我们涵盖了很多有关于
G 的内部机制

While we learned how a GraphQL server is executing these operations using a GraphQL engine, we haven’t touched on the aspect of actual client-server communication: the question how queries and their responses are transported over the network. That’s what this article is about!

虽然我们现在知道 G server 是如何利用 G engine 来执行这些操作的，但是我们还没有涉及到实际的客户端-服务端之间的通讯： 请求和响应的数据是如何在网络中被传输的。 这正是这篇文章将讲的

GraphQL servers can be implemented in any of your preferred programming languages. This article is focussing on JavaScript and the available libraries helping you to build your server, most notably: express-graphql, apollo-server and graphql-yoga.

Graphql 服务能够用任何你青睐的语言实现,在这篇文章中我们将聚焦于 JavaScript 和用来帮助你构建服务的库，主要有 express-graphql, apollo-server and graphql-yoga.

Serving GraphQL over HTTP
GraphQL is transport-layer agnostic
A key thing to understand about GraphQL is that it’s actually agnostic to the way how data is transferred over the network. This means a GraphQL server potentially could work based on protocols other than HTTP, like WebSockets or the lower-level TCP. However, this article focusses on the most common way to implement GraphQL servers today, which is indeed based on HTTP.

Express.js is used as a strong & flexible foundation
The following section is mainly about Express.js and its concept of middleware that’s used for GraphQL libraries like express-graphql and apollo-server. If you’re already familiar with Express, you can skip ahead to the next section.

## 在 http 上搭建 G 服务

### G 无关于传输层

一个我们需要知道的是，G 完全不涉及到数据如何在网络中的传输，这意味着 G 服务也可以使用`HTTP`以外的协议，比如`websocket`,`tcp`. 不过在这里我们只关注于最常使用的`HTTP`。

### Express.js 被用作强大且灵活的基础

> 下面的部分主要是关于`Express.js`和用来使用 G 的中间件(像`express-graphql`和`apollo-server`)。如果你已经熟悉`Express`，你可以跳过这一部分

Express.js is by far the most popular JavaScript web framework. It shines thanks to its simplicity, flexibility and performance.

All you need to get started with your own web server is code looking as follows:

`express.js`是到目前为止最流行的 JS 框架，它的简单性，灵活性和性能使其光芒四射。

###

apollo-server: Better compatibility outside the Express ecosystem
At its essence, apollo-server is very similar to express-graphql, with a few minor differences. The main difference between the two is that apollo-server also allows for integrations with lots of other frameworks, like koa and hapi as well as for FaaS provides like AWS Lambda or Azure Functions. Each integration can be installed by appending the corresponding suffix for the package name, e.g. apollo-server-express, apollo-server-koa or apollo-server-lambda.

However, at the core it also simply is a middleware bridging the HTTP layer with the GraphQL engine provided by GraphQL.js. Here is what an equivalent implementation of the above express-graphql-based example looks like with apollo-server-express:

是`express`之外更好兼容性的生态系统。  
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

graphql-yoga: The easiest way to build a GraphQL server

Removing friction when building GraphQL servers
Even when using express-graphql or apollo-server, there are various points of friction:

Requires installation of multiple dependencies
Assumes prior knowledge of Express
Complicated setup for using GraphQL subscriptions
This friction is removed by graphql-yoga, a simple library for building GraphQL servers. It essentially is a convenience layer on top of Express, apollo-server and a few other libraries to provide a quick way for creating GraphQL servers. (Think of it like create-react-app for GraphQL servers.)

Here is what the same GraphQL server we already saw with express-graphql and apollo-server looks like:

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
