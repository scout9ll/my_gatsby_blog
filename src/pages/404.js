import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const h1Style = {
  gridColumn: `full`,
  marginTop: `50px`,
  textAlign: "center",
}

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h2 style={h1Style}>NOT FOUND</h2>
    <h3 style={h1Style}>
      You just hit a route that doesn&#39;t exist... the sadness.
    </h3>
  </Layout>
)

export default NotFoundPage
