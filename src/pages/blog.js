import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import { Link, useStaticQuery, graphql } from "gatsby"
import "./style/blog.scss"
import "./style/notes.scss"
const Blog = () => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
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
              weather
            }
          }
        }
      }
    }
  `)
  const initBlogs = data.allMarkdownRemark.edges
  const [blogs, setBlogs] = useState(initBlogs)
  const [query, setQuery] = useState("")

  useEffect(
    () =>
      setBlogs(
        query.trim() === ""
          ? initBlogs
          : initBlogs.filter(edge =>
              edge.node.frontmatter.tags.some(tag =>
                tag.toUpperCase().includes(query.toUpperCase())
              )
            )
      ),
    [query]
  )

  return (
    <Layout>
      <div className="blogs">
        <input
          className="blog-search"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
          }}
          placeholder={"Preceding keywords to match tags."}
        />

        <div className="blog-list">
          {blogs.map(({ node }) => {
            return (
              <div key={node.frontmatter.path} className="blog-block">
                <div className="blog-condition">
                  <span> {node.frontmatter.date} </span>
                  <span> {node.frontmatter.weather} </span>
                </div>
                <Link to={node.frontmatter.path} className="blog-title">
                  {node.frontmatter.title}
                </Link>
                <div className="tags">
                  {node.frontmatter.tags.map(tag => (
                    <span
                      className="tag"
                      name={tag}
                      onClick={() => setQuery(tag)}
                      key={tag}
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
