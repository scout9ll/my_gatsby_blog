import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"


const h1Style={
  gridColumn: `full`,
    margin: `50px 0`
}

const NotFoundPage = () => 


(
  <Layout>
    <SEO title="404: Not found" />
    <h1 style={h1Style} >NOT FOUND</h1>
    <p style={h1Style}>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export default NotFoundPage
