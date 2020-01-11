const { useState, useEffect } = React;

function getRandomNum (r, b) {
  const normalNum = [...r]
  const specNum = [...b]

  const ans = []

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * normalNum.length)
    const selectedNum = normalNum.splice(index, 1)
    ans.push(selectedNum[0])
    ans.sort((a, b) => a - b)
  }

  const specIndex = Math.floor(Math.random() * specNum.length)
  ans.push(specNum[specIndex])

  return ans
}

const keys = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6']

const resRed = {}
const resBlue = {}

const addRec = (num, res) => {
  if (!res[num]) {
    res[num] = 1
  } else {
    res[num] = res[num] + 1
  }
}

const Balls = ({ data }) => {
  return (
    <div
      style={{
        margin: '8px 0',
        borderRadius: 5,
        padding: 12,
        display: 'flex',
        boxShadow: '0px 0px 1px rgba(0, 0, 0, .4)',
        justifyContent: 'space-around',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {
        data.map((n, index) => {
          return (
            <span
              style={{
                boxShadow: '0px 0px 1px rgba(0, 0, 0, .1)',
                flexShrink: 0,
                textAlign: 'center',
                lineHeight: '36px',
                width: 36,
                height: 36,
                borderRadius: '50%',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: index === data.length - 1 ? '#1890ff' : '#f5222d'
              }}
            >
              {n.toString().padStart(2, '0')}
            </span>
          )
        })
      }
    </div>
  )
}

const App = () => {
  const [balls, setBalls] = useState([])
  useEffect(() => {
    const y = new Date().getFullYear().toString()
    const m = (new Date().getMonth() + 1).toString().padStart(2, '0')
    const d = (new Date().getDate()).toString().padStart(2, '0')
    const dateEnd = new Date(`${y}-${m}-${d} 08:00:00`).getTime()
    fetch(`https://api.1qa.link/lottery/get?dateStart=1045929600000&dateEnd=${dateEnd}`)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        const total = data.content.length
        const redAvg = total * 6 / 33
        const blueAvg = total / 16
        data.content.forEach((rec) => {
          Object.keys(rec).forEach(k => {
            if (keys.includes(k)) {
              addRec(rec[k], resRed)
            }
            if (k === 'blue') {
              addRec(rec[k], resBlue)
            }
          })
        })
        const r = []
        const b = []
        Object.keys(resRed).forEach((k) => {
          if (resRed[k] <= redAvg) {
            r.push(+k)
          }
        })
        Object.keys(resBlue).forEach((k) => {
          if (resBlue[k] <= blueAvg) {
            b.push(+k)
          }
        })
        if (r.length < 6 || b.length === 0) {
          alert('数据错误')
        } else {
          setBalls(
            [
              getRandomNum(r, b),
              getRandomNum(r, b),
              getRandomNum(r, b),
              getRandomNum(r, b),
              getRandomNum(r, b)
            ]
          )
        }
      })
  }, [])
  return (
    balls.length > 0 ? (
      balls.map((data, index) => (
        <Balls key={index} data={data} />
      ))
    ) : (
      <p>获取历年双色球数据并计算中…</p>
    )
  )
}

ReactDOM.render(<App />, document.getElementById("app"));