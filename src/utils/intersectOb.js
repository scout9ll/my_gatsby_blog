function observer(eles, cb) {
  const targets = document.querySelectorAll(eles)

  const targetOb = ele => {
    if (IntersectionObserver) {
      const ob = new IntersectionObserver(([entry, ...entrys]) => {
        if (entry.isIntersecting) {
          const target = entry.target
          cb(target)
          ob.disconnect()
        }
      })

      ob.observe(ele)
    } else {
      cb(ele)
    }
  }
  targets.forEach(targetOb)
}

export default observer
