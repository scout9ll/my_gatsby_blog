---
path: "/blog/docker-and-frontend"
date: "2021-01-21"
title: "Docker与前端"
tags: ["Docker", "前端", "部署"]
weather: 🌧️
---

> 转眼到了 2021，自己对于 2020 还不知道怎么总结，却发现很多大厂都已经推送的年度技术总结，各个内容详实且全面，不得不感慨大公司的技术沉淀，粗略看了看发现大家都有关注到前端的构建与部署，什么 serverless 前端部署、云构建等，并且里面大多都用到 docker 这一技术。这让我很好奇，docker 不是用作运维交付的吗，在前端领域作用什么呢？带着这份好奇开始学习了 docker，并尝试思考 docker 之于前端的意义。

## 什么是 Docker

Docker 是一个用于开发、发布和运行应用程序的开放平台。Docker 提供的`容器（container）` 能够将你的应用程序从你的基础设施中分离出来，这样你就可以快速地交付软件。使用 Docker，你可以像管理应用一样管理你的基础设施。通过利用 Docker 的方法来快速地发布、测试和部署代码，你可以显著减少编写代码和在生产环境中运行代码之间的延迟。

## 用 Docker 来做什么

- 快速、一致地交付应用程序

- 响应式部署和扩展

- 在同一硬件上运行更多的工作负载

## Docker 基本概念

Docker 是一个 C/S 架构的平台，Docker 客户端与 Docker 守护程序（`deamon`）进行交互，该守护程序主要负责构建，运行和分发 Docker 容器。Docker 客户端和守护程序可以在同一系统上运行，或者你也可以将 Docker 客户端连接到远程 Docker 守护程序。 Docker 客户端和守护程序在 UNIX 套接字或网络接口上使用 REST API 进行通信。

![docker-architecture](https://docs.docker.com/engine/images/architecture.svg)

### Docker 守护进程(deamon)

Docker 守护进程(`dockerd`)监听 Docker API 请求，并管理 Docker 对象，如镜像、容器、网络和卷。守护进程也可以与其他守护进程通信来管理 Docker 服务。

### Docker 客户端

Docker 客户端（`docker`）是许多 Docker 用户与 Docker 交互的主要方式。 当你使用诸如 docker run 之类的命令时，客户端会将这些命令发送至 dockerd，然后执行它们。 docker 命令使用 Docker API。 Docker 客户端可以与多个守护程序通信。

### Docker registries

Docker 的镜像仓库

Docker 镜像仓库存储 Docker 镜像。Docker Hub 是一个任何人都可以使用的公共注册中心，默认情况下，Docker 被配置为在 Docker Hub 上查找镜像。你甚至可以运行自己的私有镜像仓库。

### Docker 对象

当你使用 Docker 时，你就会创建并使用镜像（`image`）、容器（`container`）、网络(`network`)、卷(`volume`)、插件（`plugin`）和其他对象。这里主要介绍在实操中几个关键的对象

#### 镜像(`image`)

镜像是一个只读的模板，带有创建 Docker 容器的指令。通常，一个镜像基于另一个镜像，并带有一些额外的定制。例如，你可以构建一个基于 ubuntu 镜像的镜像，但要安装 Apache web 服务器和你的应用程序，以及运行应用程序所需的配置细节。

你可以创建自己的镜像，也可以仅使用其他人在`docker hub`上发布的镜像。 要构建自己的镜像，你可以使用简单的语法创建一个 `Dockerfile`，以定义创建镜像并运行它所需的步骤。 `Dockerfile` 中的每条指令都会在镜像中创建一个层。 当你更改 `Dockerfile` 并重建镜像时，_仅重建那些已更改的层_。 与其他虚拟化技术相比，这是使镜像如此轻巧，小型和快速的部分原因。

#### 容器(`container`)

容器是一个`镜像`运行在`docker engine`上的实例(一个进程)。你可以使用 Docker API 或 CLI 创建、启动、停止、移动或删除容器。你可以将容器连接到一个或多个网络，为其附加存储，甚至根据其当前状态创建一个新镜像。

默认情况下，容器与其他容器及其主机相对隔离。你可以控制容器的网络、存储或其他底层子系统与其他容器或主机之间的隔离程度。

容器是由它的镜像以及你提供给它的任何配置选项定义的

> 容器的运行模式 vs VM 的运行模式
><div class="double-img" style="display:flex">
  <img src="https://www.docker.com/sites/default/files/d8/2018-11/docker-containerized-appliction-blue-border_2.png" style="width:50%" />
  <img src="https://www.docker.com/sites/default/files/d8/2018-11/container-vm-whatcontainer_2.png" style="width:50%" />
</div>  

#### 卷(`volume`)

一个容器运行时，~~它使用镜像中的各个层作为其文件系统~~它会使用特定的文件系统。 每个容器还拥有自己的*暂存空间*来创建/更新/删除文件。

为了能够保证容器中的数据能够持久化，docker 提供了`卷`,`卷`是 docker 在主机存储空间中创建的一个目录，Docker 会管理这个目录的内容，它有自己的文件系统。我们可以通过`卷`让主机与容器及容器与容器之间共享并持久化数据。

![docker-volume-share](https://docs.docker.com/storage/images/volumes-shared-storage.svg)
![docker-volume](https://steve911.oss-cn-shanghai.aliyuncs.com/image/docker-volume.png)

> 在 docker 早期，一般是通过`bind mounts`来共享主机与容器内的数据，这种方式能表现出更高的性能，因为它直接采用主机的文件系统，很适合用于开发。
> ![types-of-mounts-bind](https://docs.docker.com/storage/images/types-of-mounts-bind.png)

## 使用 Docker 的关键步骤

### Installation & Tooling

[见官网](https://docs.docker.com/get-docker/)

### Build an Image

- 创建 Dockerfile,其决定如何构建镜像
- 执行 docker build

  ```sh
  docker build -t 911/docker-test:1.0 .
  ```

### Run a Container

```sh
docker run -p 3000:3000 911/docker-test:1.0
```

- `-p 3000:3000`将主机的 3000 端口映射到容器内的 3000 端口

### Debugging

通过 `inspect` 可以直接进入容器进行调试操作

### Docker Compose

- 创建 docker-compose.yml,其决定如何编排多容器组合运行
- 执行 docker-compose up

  ```sh
   docker-compose up
  ```

## Docker 在前端的使用

根据 Docker 的特性，我们可以发现其作为服务端部署是绝佳的应用场景，那么我们前端能够用到它吗？

实际上是有的，如今前端项目都高度工程化，页面产物的构建所依赖的前置环境越来越多，这就会导致开发准备成本的增加、构建产物不稳定性的增加。那么这样的场景下，我们就可以利用 Docker 创建一个集成前端开发及构建环境的镜像，之后的开发与构建都在此镜像的容器中进行。

### 统一环境开发

将业务代码作为`volume`，使运行在容器内的前端应用根据主机的业务代码进行编译运行及监听，保证开发时的热加载，完美替换过去的开发模式。

这里使用以 vite 构建（`npm init vite-app vite-docker`）的 vue3 为模板项目

然后我们`cd vite-docker`进入项目文件，极速搭建一个 docker 容器的开发环境

- step1:创建`Dockerfile`

  ```Dockerfile
  FROM node:12

  WORKDIR /app

  COPY package*.json ./

  RUN npm install

  COPY . .
  ```

- step2:构建镜像

  ```sh
  docker build -t scout911/vite-vue:1.0 .
  ```

  这里构建了一个名为 scout911/vite-vue:1.0 的镜像

- step3:生成开发环境的容器

  ```sh
  # linux
  docker run -v $(pwd)/src:/app/src  -p 3000:3000  scout911/vite-vue:1.0  npm run dev
  ```

  这里我们通过`-v $(pwd)/src:/app/src`将本地主机的/\$(pwd)/src 挂载到容器内的 src ，这样我们就可直接修改本地的文件来进行调试开发

### 统一环境部署

将前端应用构建在与开发一致的`容器`环境中，确保了开发与生产的一致性，也保证的构建输出的唯一性。

在现今前后端分离的模式下，我们前端的项目都是独立部署，一般有两种方式：

- 通过静态代理在宿主机（例入 NGNIX）
- 将前端文件上传到对象存储服务(例如阿里的 OSS,腾讯的 COS)

这两种方式的区别在于对构建产物的处理方式。无论何种方式都可以结合以`docker`容器为运行环境的构建打包。

## 参考

- [https://docs.docker.com/get-started/overview/](https://docs.docker.com/get-started/overview/)
- The Complete Works of Tao Technology
- [serverless 在前端部署领域的实践](https://www.yuque.com/office/yuque/0/2020/pdf/333434/1608622060089-7f994590-83e8-4cdd-a90a-931eb6769065.pdf?from=https%3A%2F%2Fwww.yuque.com%2Fd2forum%2Fcontent%2Fbxb7n5)
