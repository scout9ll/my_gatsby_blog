import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./style/about.scss"
const About = () => {
  return (
    <Layout>
      <SEO title="关于" />
      <div className="about-container">
        <h3>
          whoop! <span>🤔</span> 看来作者还没准备好发布
        </h3>
      </div>
    </Layout>
  )
}

export default About
