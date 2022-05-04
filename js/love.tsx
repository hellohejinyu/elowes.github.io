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
      '瑞宝你好',
      '见字如面，见信如唔',
      '转眼间到了三百天了',
      '可是这尾巴上的六十天我们却无法相见',
      '呜呼哀哉',
      '连背景音乐此时此刻仿佛也悲伤了起来',
      '这个一百天真是让人难熬呀',
      '每天的日子就是重复重复再重复',
      '重复做核酸、重复抢菜、重复做饭',
      '最最痛苦的都是我一个人在做这些事情',
      '同时也被迫达成了60天没相聚的伤心成就',
      '我写到此处，在晶莹的泪光中',
      '仿佛又看见你小巧玲珑的背影',
      '唉！不知何时再能与你相见！',
      '这一百天最大的收获应该就是厨艺了',
      '等解封的时候让你尝尝我做的臭豆腐和锅贴',
      '对了，很抱歉因为快递停了无法准备礼物',
      '三百天的可口可乐是见不到了',
      '但是！',
      '我仍然很贴心的为你准备了一份快乐！',
      '就是那个让我憋了很久的快乐！',
      '请你立刻马上微信给我发送下面的暗号',
      'WHERE IS HAPPY',
      '然后你就能收获到属于三百天的快乐啦',
      '2022 年 4 月，何凯俊书于银河小区',
      '温馨提示：这次的背景音乐包含彩蛋哟',
      '以你的聪明才智肯定能发现～嘻嘻～',
      '爱你的第三百天',
      'HERUI.LOVE',
    ]
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
      : ['~三百天~', '～吼吼吼～', '~期待四百天~']
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
    if (time && time.day === 298 && hide) {
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
                  ——<span style={{ marginLeft: 8 }}>{poem[1]}</span>
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
                <div className="big">叁佰天</div>
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
              src="https://cdn.30x.link/love3.mp3"
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
