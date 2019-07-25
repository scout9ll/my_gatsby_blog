import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"

const Header = ({ siteTitle }) => {
  const [acNav, setAcNav] = useState(false)
  const [href, setHref] = useState("")
  useEffect(() => {
    document.addEventListener("scroll", () =>
      window.scrollY == 0 ? setAcNav(false) : setAcNav(true)
    )
    setHref(window.location.href)
  }, [])

  return (
    <header
      style={
        acNav
          ? {
              background: "#fecd0ee3",

              boxShadow: "-1px 4px 2px 2px wheat",
            }
          : {}
      }
    >
      <nav>
        <Link to="/blog" className={href.includes("blog") ? "nav-active" : ""}>
          tech
        </Link>
        <Link
          to="/notes"
          className={href.includes("notes") ? "nav-active" : ""}
        >
          note
        </Link>
        <Link to="/">
          <div className="logo">{siteTitle}</div>
        </Link>
        <a>essay</a>
        <a>about</a>
      </nav>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
