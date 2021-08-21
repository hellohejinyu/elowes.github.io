import waves from '/js/waves.js'
const { useEffect, useState } = React
const ReactP5Wrapper = window.ReactP5Wrapper

const convertToChinaNum = (num) => {
  const arr1 = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const arr2 = ['', '十', '佰', '仟', '万', '十', '佰', '仟', '亿']
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

const Item = ({ prefix, num, label }) => (
  <div className="item">
    {prefix}
    {convertToChinaNum(num)}
    {label}
  </div>
)

function secondsFormat (s) {
  const day = Math.floor(s / (24 * 3600))
  const hour = Math.floor((s - day * 24 * 3600) / 3600)
  const minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60)
  const second = s - day * 24 * 3600 - hour * 3600 - minute * 60
  return { day, hour, minute, second }
}

const App = () => {
  const [time, setTime] = useState()
  const [poem, setPoem] = useState([])
  useEffect(() => {
    const calc = () => {
      setTime(
        secondsFormat(
          Math.floor(
            (new Date().getTime() - new Date(2021, 6, 10).getTime()) / 1000
          )
        )
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
    }, 250)
  }, [])

  useEffect(() => {
    document.title = 'RUI.LOVE'
  }, [])

  return (
    <div className="root">
      <div style={{ fontSize: 0 }}>
        <ReactP5Wrapper sketch={waves} isPlaying />
      </div>
      {time && (
        <div className="days">
          <Item prefix="相识" num={time.day} label="天" />
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

ReactDOM.render(<App />, document.getElementById('app'))
