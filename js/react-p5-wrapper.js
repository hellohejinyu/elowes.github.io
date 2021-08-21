import deepEqual from '/js/fast-deep-equal.js'
const { createRef, memo, useEffect, useState } = React

function createCanvas (sketch, container) {
  // eslint-disable-next-line new-cap
  return new p5(sketch, container)
}

const ReactP5WrapperComponent = ({
  sketch,
  children,
  ...props
}) => {
  const wrapper = createRef()
  const [instance, setInstance] = useState()

  useEffect(() => {
    if (wrapper.current === null) return
    instance?.remove()
    const canvas = createCanvas(sketch, wrapper.current)
    setInstance(canvas)
  }, [sketch, wrapper.current])

  useEffect(() => {
    instance?.updateWithProps?.(props)
  }, [props])

  return <div ref={wrapper}>{children}</div>
}

const ReactP5Wrapper = memo(
  ReactP5WrapperComponent,
  (previousProps, nextProps) => {
    return deepEqual(previousProps, nextProps)
  }
)

window.ReactP5Wrapper = ReactP5Wrapper
