import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const About = () => {
  return (
    <Layout>
      <SEO title="关于" />
      <div className="about-container" style={{ girdColumn: "full" }}>
        <p>hi! 我是steve </p>
      </div>
    </Layout>
  )
}

export default About
