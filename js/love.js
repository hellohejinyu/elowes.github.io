const { useEffect, useState } = React;

const Item = ({ num, label }) => (
  <div className='item'>
    {num.toString().padStart(2, '0').split('').map((l) => <div>{l}</div>)}
    <span>{label}</span>
  </div>
)

function secondsFormat(s) {
  var day = Math.floor(s / (24 * 3600));
  var hour = Math.floor((s - day * 24 * 3600) / 3600);
  var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
  var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
  return { day, hour, minute, second };
}

const App = () => {
  const [time, setTime] = useState()
  const [know, setKnow] = useState()
  useEffect(() => {
    const calc = () => {
      setTime(secondsFormat(Math.floor((new Date().getTime() - new Date(2020, 9, 1).getTime()) / 1000)))
      setKnow(secondsFormat(Math.floor((new Date().getTime() - new Date(2020, 2, 22).getTime()) / 1000)))
    }
    calc();

    setInterval(() => {
      calc();
    }, 250);
  }, []);
  return (
    <div className='root'>
      <div>
        {know && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Item num={know.day} label='DAY' />
          </div>
        )}
        {time && (
          <div style={{ display: 'flex', marginTop: 32 }}>
            <Item num={time.day} label='D' />
            <Item num={time.hour} label='H' />
            <Item num={time.minute} label='M' />
            <Item num={time.second} label='S' />
          </div>
        )}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("app"));