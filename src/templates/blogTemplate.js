import React, { useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import "../pages/style/blog.scss"
import SEO from "../components/seo"
import "gitalk/dist/gitalk.css"
import Gitalk from "gitalk"
export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  console.log(data)
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  useEffect(() => {
    var gitalk = new Gitalk({
      clientID: "8f16fd9d681947e2f3f8",
      clientSecret: "dfb43d6f99c32565cb14c109e03fcd42b417954b",
      repo: "my_gatsby_blog",
      owner: "scout9II",
      admin: ["scout9II"],
      id: window.location.pathname, // Ensure uniqueness and length less than 50
      distractionFreeMode: false, // Facebook-like distraction free mode
    })

    gitalk.render("gitalk-container")
  }, [])
  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        meta={[{ name: "keywords", content: frontmatter.tags.join(",") }]}
      />
      <div className="blog-post-container">
        <div className="blog-post">
          <h2>{frontmatter.date}</h2>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <div id="gitalk-container"></div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        tags
      }
    }
  }
`
