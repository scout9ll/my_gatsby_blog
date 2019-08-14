/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`)

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  //获取绝对路径
  const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`)
  //获取MD的path(url).then generate page
  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        filter: { frontmatter: { path: { regex: "/" } } }
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    return result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const path = node.frontmatter.path
      if (path.includes("blog")) {
        createPage({
          path: path,
          component: blogPostTemplate,
          context: {}, // additional data can be passed via context
        })
      } else if (path.includes("essay")) {
        return
      }
    })
  })
}
