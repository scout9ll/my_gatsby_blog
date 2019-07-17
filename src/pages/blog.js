import React, { useState } from "react"
import Layout from "../components/layout"
import { Link, useStaticQuery, graphql } from "gatsby"
import "./style/blog.scss"
import "./style/notes.scss"
const Blog = () => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: { frontmatter: { path: { regex: "/blog/" } } }
      ) {
        edges {
          node {
            id
            html

            frontmatter {
              title
              date
              path
              tags
            }
          }
        }
      }
    }
  `)
  const initBlogs = data.allMarkdownRemark.edges
  const [blogs, setBlogs] = useState(initBlogs)

  return (
    <Layout>
      <div className="blogs">
        <div className="blog-list">
          {blogs.map(({ node }) => {
            return (
              <div key={node.frontmatter.path} className="blog-block">
                <Link to={node.frontmatter.path} className="blog-title">
                  {node.frontmatter.title}
                </Link>
                <div className="blog-date">{node.frontmatter.date}</div>
                <div className="tags">
                  {node.frontmatter.tags.map(tag => (
                    <span
                      className="tag"
                      name={tag}
                      onClick={() =>
                        setBlogs(
                          initBlogs.filter(edge =>
                            edge.node.frontmatter.tags.includes(tag)
                          )
                        )
                      }
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
export default Blog
