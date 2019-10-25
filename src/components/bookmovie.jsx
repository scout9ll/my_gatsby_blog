import React from "react"

const BookOrMovie = ({ title, src, img }) => {
  return (
    <a title={title} href={src}>
      <img src={img} alt="" style={{ width: "135px", maxHeight: "200px" }} />
    </a>
  )
}

export default BookOrMovie
