import waves from '/js/waves.js'
import deepEqual from '/js/fast-deep-equal.js'

// @ts-expect-error
const { createRef, memo, useEffect, useState, useMemo, useRef } = React

const createCanvas = (sketch, container) => {
  // @ts-expect-error
  // eslint-disable-next-line new-cap
  return new p5(sketch, container)
}

// @ts-expect-error
const convertToChinaNum = (number: number) => Nzh.cn.encodeB(number)

const maxLen = 4

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
  suffix,
}: {
  prefix?: string
  num?: number
  suffix?: string
}) => {
  const renderer = useMemo(() => {
    if (!num) {
      return null
    }
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
      {prefix?.split('').map((l, i) => (
        <span key={i}>{l}</span>
      ))}
      {renderer?.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
      {suffix?.split('').map((l, i) => (
        <span key={i}>{l}</span>
      ))}
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

const startTime = new Date(2021, 6, 10, 17, 40).getTime()
// const startTime = new Date(2021, 6, 10, 0, 0).getTime()

// const getFutureDays = (days: number) => {
//   const targetTime = days * 24 * 60 * 60 * 1e3 + startTime
//   const targetDate = new Date(targetTime)
//   const year = targetDate.getFullYear()
//   const month = targetDate.getMonth() + 1
//   const date = targetDate.getDate()

//   const toChinaNum = (s: number) =>
//     (s + '')
//       .split('')
//       .map((l) => convertToChinaNum(parseInt(l)))
//       .join('')

//   return `${toChinaNum(year)}年${convertToChinaNum(month)}月${convertToChinaNum(
//     date,
//   )}日`
// }

let index = 0

const App = () => {
  const [time, setTime] = useState<{
    day: number
    hour: number
    minute: number
    second: number
    ms: number
  }>()
  const [poem, setPoem] = useState([])
  const [hide, setHide] = useState(true)
  const [clicked, setClicked] = useState(false)
  const audioRef = useRef(null)
  const [magicName, setMagicName] = useState('')
  const [ended, setEnded] = useState(false)
  const name = useTypeWritter(magicName)
  const ss = useMemo(() => {
    const res = [
      '亲爱的早\\中\\晚上好',
      '现在是一月十号的晚上',
      '已经和你说完晚安了哦',
      '我又在电脑前开始酝酿感情了',
      '可惜你看不到我现在的动作',
      '简直可以说是手舞足蹈了',
      '真开心我们有了爱情主打歌:)',
      '接下来说说这个一百天',
      '首先我们的微信头像坚持了下来',
      '我还是你手心的旺仔牛奶',
      '然后我们更加契合了',
      '我心里早就已经决定非你不嫁了',
      '而且，在你看到这个的时候',
      '我们应该已经见过双方的父母',
      '恐怕到了商量啥时候结婚的事情了，嘿嘿',
      '这一百天，我们一起追完了喜剧大赛',
      '这一百天，我们做了不知道多少顿饭',
      '这一百天，我们一次架都没有吵',
      '一切的一切都是那么的和谐',
      '我有时候在想，莫非我失忆了？',
      '我是和你结婚很久了吗？',
      '为什么感觉你给我的感觉只有熟悉',
      '天作之合应该就是指咱俩',
      '大家都说如果两个人在一起',
      '能够让彼此变得更好',
      '那才是爱情的价值和意义',
      '那我觉得你做到了',
      '感谢这个一百天你的照顾',
      '宝贝您辛苦了！',
      '我们一起度过了 2021 年',
      '接下来想必也要一起度过 2022、2023、20..',
      '很高兴认识你，我的宝～',
      '我的未来就再次拜托你了',
      '2022 年 1 月，何凯俊书于银河小区',
      'HERUI.LOVE',
    ]
    if (time && time.day === 199) {
      return [
        res[0],
        '今天是第 199 天',
        '提前祝我们两百天快乐～',
        '爱你！爱你！爱你！',
        ...res.slice(1),
      ]
    }
    return res
  }, [time])
  useEffect(() => {
    const calc = () => {
      setTime(msFormat(Math.floor(new Date().getTime() - startTime)))
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
    }, 1500)
  }, [])

  useEffect(() => {
    const titles = hide
      ? ['～你爱我～', '～我爱你～', '～蜜雪冰城甜蜜蜜～']
      : ['~两百天~', '～吼吼吼～', '~期待三百天~']
    let index = 0
    document.title = titles[index % titles.length]
    const timer = setInterval(() => {
      index++
      document.title = titles[index % titles.length]
    }, 1300)
    return () => {
      clearInterval(timer)
    }
  }, [hide])

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

  useEffect(() => {
    if (time && (time.day === 200 || time.day === 194) && hide) {
      setHide(false)
    }
  }, [time, hide])

  useEffect(() => {
    if (!hide && clicked) {
      setTimeout(() => {
        setMagicName(ss[index])
        index++
      }, 1e3)
      const timer = setInterval(() => {
        setMagicName(ss[index])
        index += 1
        if (index === ss.length) {
          clearInterval(timer)
          setTimeout(() => {
            setEnded(true)
          }, 3e3)
        }
      }, 5e3)
    }
  }, [hide, clicked])

  return (
    <>
      <div className="root">
        <div style={{ fontSize: 0 }}>
          <ReactP5Wrapper sketch={waves} isPlaying />
        </div>
        {hide ? (
          <>
            {time && (
              <div className="days">
                <Item
                  num={Number((time.day + dot).toFixed(maxLen))}
                  suffix={`天`}
                />
              </div>
            )}
            {/* <div className="feature">
        <div>{getFutureDays(100)}</div>
        <div>{getFutureDays(1000)}</div>
        <div>{getFutureDays(10000)}</div>
      </div> */}
            {poem && (
              <div className="poem">
                <div style={{ textAlign: 'justify', lineHeight: 1.5 }}>
                  {poem[0]}
                </div>
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  ——&nbsp;&nbsp;{poem[1]}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="hide-root">
            {clicked ? (
              <>
                <div
                  style={{
                    fontSize: ended ? 40 : 'initial',
                    transition: 'font-size .6s',
                  }}
                >
                  {name}
                </div>
              </>
            ) : (
              <>
                <div className="big">贰佰天</div>
                <div
                  className="btn"
                  onClick={() => {
                    audioRef.current?.play()
                    setClicked(true)
                  }}
                >
                  点我继续
                </div>
                <div
                  style={{
                    transform: 'scale(0.8)',
                    fontSize: 12,
                    marginTop: 32,
                    color: '#666',
                  }}
                >
                  *会有音乐播放，请注意当前场合
                </div>
              </>
            )}
            <audio
              ref={audioRef}
              style={{ display: 'none' }}
              src="https://cdn.30x.link/love2.mp3"
              autoPlay
            />
          </div>
        )}
      </div>
    </>
  )
}

// @ts-expect-error
ReactDOM.render(<App />, document.getElementById('app'))
