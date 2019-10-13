import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./style/about.scss"
const About = () => {
  return (
    <Layout>
      <SEO title="关于" />
      <div className="about-container">
        <h3>Hi! here is steve's blog </h3>
        <p>
          这个博客基于 React 框架 ,使用GatsbyJS 搭配 GraphQL 开发，托管在{" "}
          <a href="https://github.com/steve9II/my_gatsby_blog">GitHub</a>{" "}
          上,并利用webhook持续集成在自己的阿里云上
          <p>
            CSS样式借鉴了一个小众纯CSS框架PaperCss,Sass 模块的设计借鉴了 BEM
            思想。
          </p>
        </p>
      </div>
    </Layout>
  )
}

export default About
