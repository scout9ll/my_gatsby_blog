import React, { useState } from "react"
import "../pages/style/blog.scss"

const Note = ({ noteContent, title, subTitle }) => {
  //   const [open, setOpen] = useState(false)
  const [scale, setScale] = useState(0)
  //   let ss = () => (open ? setScale(1) : "")
  return (
    <div
      className="note-block"
      onClick={() => {
        setScale(1)
      }}
    >
      <div className="note-view-container">
        <div className="note-card">
          <div className="note-card-front">{title[1]}</div>
          <div className="note-card-back">
            {subTitle.map((st, index) => (
              <span key={st}>
                {index + 1 + "." + st.match(/<h3>([^<]+)<\/h3>/)[1]}{" "}
              </span>
            ))}
          </div>
        </div>
      </div>
      {
        <div
          className="note-content-mask"
          style={{ transform: `scale(${scale})` }}
        >
          <div
            className="note-modal-delete"
            onClick={e => {
              e.stopPropagation()
              //   setOpen(false)
              //   console.log(open)
              setScale(0)
            }}
          >
            X
          </div>
          <div
            className="note-content"
            dangerouslySetInnerHTML={{ __html: noteContent }}
          ></div>
        </div>
      }
    </div>
  )
}
export default Note
