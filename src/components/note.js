import React, { useState, useRef } from "react"
import "../pages/style/blog.scss"

const Note = ({ noteContent, title, subTitle }) => {
  const [open, setOpen] = useState(false)
  // const [scale, setScale] = useState(0)
  const [noteStyle, setNoteStyle] = useState({})

  //   let ss = () => (open ? setScale(1) : "")
  const noteBlock = useRef()
  const openNote = () => {
    setOpen(true)
    const rect = noteBlock.current.getBoundingClientRect()
    const originStyle = {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
      width: 0,
      height: 0,
    }
    const openStyle = {}
    setNoteStyle(originStyle)
    setTimeout(() => {
      setNoteStyle(openStyle)
    })
  }
  const closeNote = () => {
    const rect = noteBlock.current.getBoundingClientRect()
    const originStyle = {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
      width: 0,
      height: 0,
    }
    setNoteStyle(originStyle)
    setTimeout(() => {
      setOpen(false)
    }, 1000)
  }
  return (
    <div className="note-block" onClick={openNote}>
      <div className="note-view-container" ref={noteBlock}>
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
      {open && (
        <div className="note-content-mask" style={noteStyle}>
          <div
            className="note-modal-delete"
            onClick={e => {
              e.stopPropagation()
              //   setOpen(false)
              //   console.log(open)
              closeNote()
            }}
          >
            X
          </div>
          <div
            className="note-content"
            dangerouslySetInnerHTML={{ __html: noteContent }}
          ></div>
        </div>
      )}
    </div>
  )
}
export default Note
