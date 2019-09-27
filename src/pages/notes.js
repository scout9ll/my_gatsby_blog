import React from "react"
import Layout from "../components/layout"
import Note from "../components/note"
import { useStaticQuery, graphql } from "gatsby"
import "./style/blog.scss"
import "./style/notes.scss"

const Notes = () => {
  const data = useStaticQuery(graphql`
    {
      markdownRemark(frontmatter: { title: { eq: "note" } }) {
        html
        frontmatter {
          date
          path
          title
        }
      }
    }
  `)
  return (
    <Layout>
      <div className="note">
        <div className="note-header">
          <div>take note&review it</div>
        </div>
        <div className="note-list">
          {data.markdownRemark.html
            .split("<h2>")
            .filter(node => node[0])
            .map(node => {
              let weekNote = "<h2>" + node

              let weekTitle = weekNote.match(/<h2>([a-zA-Z0-9_ ]+)<\/h2>/)
              let weekSubTitle = weekNote.match(/<h3>([^<]+)<\/h3>/g)

              // console.log(weekSubTitle, weekTitle)
              return (
                <Note
                  key={weekTitle}
                  title={weekTitle}
                  noteContent={weekNote}
                  subTitle={weekSubTitle}
                />
              )
            })}
        </div>
      </div>
    </Layout>
  )
}
export default Notes
