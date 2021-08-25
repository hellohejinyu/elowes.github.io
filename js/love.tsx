import waves from '/js/waves.js'
import deepEqual from '/js/fast-deep-equal.js'

// @ts-expect-error
const { createRef, memo, useEffect, useState, useMemo } = React

const createCanvas = (sketch, container) => {
  // @ts-expect-error
  // eslint-disable-next-line new-cap
  return new p5(sketch, container)
}

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

const convertToChinaNum = (num: number) => {
  const arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿']
  if (!num || isNaN(num)) {
    return '零'
  }
  const english = num.toString().split('')
  let result = ''
  for (let i = 0; i < english.length; i++) {
    const desI = english.length - 1 - i // 倒序排列设值
    result = arr2[i] + result
    const arr1Index = english[desI]
    result = arr1[arr1Index] + result
  }
  // 将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十')
  // 合并中间多个零为一个零
  result = result.replace(/零+/g, '零')
  // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万')
  // 将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿')
  // 移除末尾的零
  result = result.replace(/零+$/, '')
  // 将【零一十】换成【零十】
  // result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, '十')
  return result
}

const Item = ({
  prefix,
  num,
  label,
}: {
  prefix?: string
  num: number
  label?: string
}) => (
  <div className="item">
    {prefix && prefix.split('').map((l, i) => <span key={i}>{l}</span>)}
    {convertToChinaNum(num)
      .split('')
      .map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    {label && label.split('').map((l, i) => <span key={i}>{l}</span>)}
  </div>
)

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
    }, 1000)
  }, [])

  useEffect(() => {
    const titles = ['～你爱我～', '～我爱你～', '～蜜雪冰城甜蜜蜜～']
    let index = 0
    document.title = titles[index % titles.length]
    setInterval(() => {
      index++
      document.title = titles[index % titles.length]
    }, 1200)
  }, [])

  const dot = useMemo(() => {
    if (!time) return ''
    if (time.hour === 0 && time.minute === 0 && time.second === 0) return ''
    const max = 6
    const str = (
      time.hour / 24 +
      time.minute / 60 / 24 +
      time.second / 60 / 60 / 24 +
      time.ms / 60 / 60 / 24 / 1e3
    )
      .toFixed(max)
      .slice(2)
      .padEnd(max, '0')
    return (
      '又' +
      str
        .split('')
        .map((l) => convertToChinaNum(Number(l)))
        .join('')
    )
  }, [time])

  return (
    <div className="root">
      <div style={{ fontSize: 0 }}>
        <ReactP5Wrapper sketch={waves} isPlaying />
      </div>
      {time && (
        <div className="days">
          <Item num={time.day} label={`${dot}天`} />
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
