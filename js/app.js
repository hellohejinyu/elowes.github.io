const { useState, useEffect } = React;

function getRandomNum () {
  const normalNum = new Array(33).fill(0).map((v, index) => index + 1)
  const specNum = new Array(16).fill(0).map((v, index) => index + 1)

  const ans = []

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * normalNum.length)
    const selectedNum = normalNum.splice(index, 1)
    ans.push(selectedNum[0])
  }

  const specIndex = Math.floor(Math.random() * specNum.length)
  ans.push(specNum[specIndex])

  return ans
}

const App = () => {
  const [state, setState] = useState([])
  useEffect(() => {
    setState(
      getRandomNum()
    )
  }, [])
  return (
    <div
      style={{
        borderRadius: 5,
        padding: 12,
        display: 'flex',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, .1)',
        justifyContent: 'space-around',
        margin: `50px 12px`
      }}
    >
      {
        state.map((n, index) => {
          return (
            <span
              style={{
                boxShadow: '0px 0px 5px rgba(0, 0, 0, .1)',
                flexShrink: 0,
                textAlign: 'center',
                lineHeight: '36px',
                width: 36,
                height: 36,
                borderRadius: '50%',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: index === state.length - 1 ? '#1890ff' : '#f5222d'
              }}
            >{n}</span>
          )
        })
      }
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("app"));