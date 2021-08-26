import waves from '/js/waves.js'
import deepEqual from '/js/fast-deep-equal.js'

// @ts-expect-error
const { createRef, memo, useEffect, useState, useMemo } = React

const createCanvas = (sketch, container) => {
  // @ts-expect-error
  // eslint-disable-next-line new-cap
  return new p5(sketch, container)
}

// @ts-expect-error
const convertToChinaNum = (number: number) => Nzh.cn.encodeB(number)

const maxLen = 6

const ReactP5WrapperComponent = ({
  sketch,
  children,
  ...props
}: React.PropsWithChildren<{
  sketch: unknown
  isPlaying: boolean
}>) => {
  const wrapper = createRef<HTMLDivElement>()
  const [instance, setInstance] = useState()

  useEffect(() => {
    if (wrapper.current === null) return
    // @ts-expect-error
    instance?.remove()
    const canvas = createCanvas(sketch, wrapper.current)
    setInstance(canvas)
  }, [sketch, wrapper.current])

  useEffect(() => {
    // @ts-expect-error
    instance?.updateWithProps?.(props)
  }, [props])

  return <div ref={wrapper}>{children}</div>
}

const ReactP5Wrapper = memo(
  ReactP5WrapperComponent,
  (previousProps, nextProps) => {
    return deepEqual(previousProps, nextProps)
  },
)

const Item = ({
  prefix,
  num,
  label,
}: {
  prefix?: string
  num: number
  label?: string
}) => {
  const renderer = useMemo(() => {
    let str = convertToChinaNum(num)
    const arr = str.split('点')
    if (arr.length > 1) {
      const needAddLen = maxLen - arr[1].length
      str += new Array(needAddLen).fill('零').join('')
    }
    return str.split('')
  }, [num])
  return (
    <div className="item">
      {prefix && prefix.split('').map((l, i) => <span key={i}>{l}</span>)}
      {renderer.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
      {label && label.split('').map((l, i) => <span key={i}>{l}</span>)}
    </div>
  )
}

const msFormat = (s: number) => {
  const day = Math.floor(s / 1e3 / (24 * 3600))
  const hour = Math.floor((s - day * 24 * 3600 * 1e3) / 3600)
  const minute = Math.floor(
    (s - day * 24 * 3600 * 1e3 - hour * 3600 * 1e3) / 60,
  )
  const second = Math.floor(
    (s - day * 24 * 3600 * 1e3 - hour * 3600 * 1e3 - minute * 60 * 1e3) / 1e3,
  )
  const ms =
    s -
    day * 24 * 3600 * 1e3 -
    hour * 3600 * 1e3 -
    minute * 60 * 1e3 -
    second * 1e3
  return { day, hour, minute, second, ms }
}

const App = () => {
  const [time, setTime] = useState<{
    day: number
    hour: number
    minute: number
    second: number
    ms: number
  }>()
  const [poem, setPoem] = useState([])

  useEffect(() => {
    const calc = () => {
      setTime(
        msFormat(
          Math.floor(
            new Date().getTime() - new Date(2021, 6, 10, 18, 9).getTime(),
          ),
        ),
      )
    }
    fetch('https://v1.hitokoto.cn/?c=a&c=h&c=kencode=json&chartset=utf-8')
      .then((res) => res.json())
      .then((res) => {
        if (res.hitokoto && res.from) {
          setPoem([res.hitokoto, res.from])
        }
      })
    calc()
    setInterval(() => {
      calc()
    }, 650)
  }, [])

  useEffect(() => {
    const titles = ['～你爱我～', '～我爱你～', '～蜜雪冰城甜蜜蜜～']
    let index = 0
    document.title = titles[index % titles.length]
    setInterval(() => {
      index++
      document.title = titles[index % titles.length]
    }, 1300)
  }, [])

  const dot = useMemo(() => {
    if (!time) return 0
    if (time.hour === 0 && time.minute === 0 && time.second === 0) return 0
    const str =
      time.hour / 24 +
      time.minute / 60 / 24 +
      time.second / 60 / 60 / 24 +
      time.ms / 60 / 60 / 24 / 1e3
    return Number(str)
  }, [time])

  return (
    <div className="root">
      <div style={{ fontSize: 0 }}>
        <ReactP5Wrapper sketch={waves} isPlaying />
      </div>
      {time && (
        <div className="days">
          <Item num={Number((time.day + dot).toFixed(maxLen))} label={`天`} />
        </div>
      )}
      {poem && (
        <div className="poem">
          <div style={{ textAlign: 'justify', lineHeight: 1.5 }}>{poem[0]}</div>
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            ——&nbsp;&nbsp;{poem[1]}
          </div>
        </div>
      )}
    </div>
  )
}

// @ts-expect-error
ReactDOM.render(<App />, document.getElementById('app'))
