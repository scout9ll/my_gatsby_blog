# docker basic

## 什么是 docker

Docker 是一个用于开发、发布和运行应用程序的开放平台。Docker 提供的`容器（container）` 能够将你的应用程序从你的基础设施中分离出来，这样你就可以快速地交付软件。使用 Docker，你可以像管理应用一样管理你的基础设施。通过利用 Docker 的方法来快速地发布、测试和部署代码，您可以显著减少编写代码和在生产环境中运行代码之间的延迟。

## 用 docker 来做什么

### 快速、一致地交付应用程序

### 响应式部署和扩展

### 在同一硬件上运行更多的工作负载

## docker 基本概念

docker 是一个 C/S 架构的平台，Docker 客户端与 Docker 守护程序进行对话，该守护程序完成了构建，运行和分发 Docker 容器的繁重工作。 Docker 客户端和守护程序可以在同一系统上运行，或者您可以将 Docker 客户端连接到远程 Docker 守护程序。 Docker 客户端和守护程序在 UNIX 套接字或网络接口上使用 REST API 进行通信。

![docker-architecture](https://docs.docker.com/engine/images/architecture.svg)

### docker 守护进程(deamon)

Docker 守护进程(`dockerd`)监听 Docker API 请求，并管理 Docker 对象，如镜像、容器、网络和卷。守护进程也可以与其他守护进程通信来管理 Docker 服务。

### Docker 客户端

Docker 客户端（`docker`）是许多 Docker 用户与 Docker 交互的主要方式。 当您使用诸如 docker run 之类的命令时，客户端会将这些命令发送至 dockerd，然后执行它们。 docker 命令使用 Docker API。 Docker 客户端可以与多个守护程序通信。

### Docker registries

Docker 的镜像仓库

Docker 镜像仓库存储 Docker 镜像。Docker Hub 是一个任何人都可以使用的公共注册中心，默认情况下，Docker 被配置为在 Docker Hub 上查找镜像。您甚至可以运行自己的私有镜像仓库。

### Docker 对象

当你使用 Docker 时，你就会创建并使用镜像（`image`）、容器（`container`）、网络(`network`)、卷(`volume`)、插件（`plugin`）和其他对象。这里主要介绍在实操中几个关键的对象

#### 镜像(`image`)

镜像是一个只读的模板，带有创建 Docker 容器的指令。通常，一个镜像基于另一个镜像，并带有一些额外的定制。例如，您可以构建一个基于 ubuntu 镜像的镜像，但要安装 Apache web 服务器和您的应用程序，以及运行应用程序所需的配置细节。

您可以创建自己的镜像，也可以仅使用其他人创建并在`docker hub`上发布的镜像。 要构建自己的镜像，您可以使用简单的语法创建一个 `Dockerfile`，以定义创建镜像并运行它所需的步骤。 `Dockerfile` 中的每条指令都会在镜像中创建一个层。 当你更改 `Dockerfile` 并重建镜像时，_仅重建那些已更改的层_。 与其他虚拟化技术相比，这是使镜像如此轻巧，小型和快速的部分原因。

#### 容器(`container`)

容器是一个`镜像`运行在`docker engine`上的实例(一个进程)。你可以使用 Docker API 或 CLI 创建、启动、停止、移动或删除容器。您可以将容器连接到一个或多个网络，为其附加存储，甚至根据其当前状态创建一个新镜像。

默认情况下，容器与其他容器及其主机相对隔离。您可以控制容器的网络、存储或其他底层子系统与其他容器或主机之间的隔离程度。

容器是由它的镜像以及您提供给它的任何配置选项定义的

> 容器的运行模式 vs VM 的运行模式
> ![CONTAINERS](https://www.docker.com/sites/default/files/d8/2018-11/docker-containerized-appliction-blue-border_2.png) > ![VM](https://www.docker.com/sites/default/files/d8/2018-11/container-vm-whatcontainer_2.png)

#### 卷(`volume`)

一个容器运行时，~~它使用镜像中的各个层作为其文件系统~~它会使用特定的文件系统。 每个容器还拥有自己的*暂存空间*来创建/更新/删除文件。

为了能够保证容器中的数据能够持久化，docker 提供了`卷`

卷提供了将容器的特定文件系统路径连接回主机的功能。 如果装入了容器中的目录，则在主机上也会看到该目录中的更改。 如果我们在重新启动容器时挂载相同的目录，则会看到相同的文件。

![docker-volume-share](https://docs.docker.com/storage/images/volumes-shared-storage.svg)
![docker-volume](https://steve911.oss-cn-shanghai.aliyuncs.com/image/docker-volume.png)

## run docker

### Installation & Tooling

见官网

### Build an Image

- 创建 dockerFile,其决定如何构建镜像
- 执行 docker build

  ```sh
  docker build -t 911/docker-test:1.0 .
  ```

### Run a Container

```sh
docker run -p 8080:8080 911/docker-test:1.0
```

### Debugging

inspect

### Docker Compose

- 创建 docker-compose.yml,其决定如何编排多容器组合运行
- 执行 docker-compose up

  ```sh
   docker-compose up
  ```

## docker 在前端的使用

### 统一环境开发

将业务代码作为`volume`，完美实现以容器替换过去本地系统服务开发的方式

### 统一环境部署
