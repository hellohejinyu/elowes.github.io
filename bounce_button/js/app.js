const { PureComponent } = React;

class App extends PureComponent {
  state = {
    scale: 1,
    count: 0,
    love: false
  }

  render() {
    const { scale, count, love } = this.state;

    return <div>
      <div className="heart"></div>
      <h1>我爱你，你爱我吗？</h1>
      {
        count > 0 && !love && <p style={{ textAlign: 'center' }}>真的不考虑一下我吗？o(╥﹏╥)o（{count}次）</p>
      }
      <div className='btns'>
      {
        count !== 20 &&
        <button
          onClick={() => {
            this.setState({
              love: true
            })
            alert('我知道啦(づ￣ 3￣)づ');
          }}
        >爱你</button>
      }
        <button
          style={{ transform: `scale(${scale})` }}
          onClick={() => {
            if (love) {
              return alert('已经爱我了，不可以再说不爱，╭(╯^╰)╮');
            }
            if (count === 19) {
              alert('我本将心向明月，奈何明月照沟渠啊~~~');
            }
            this.setState({
              scale: scale-0.05,
              count: count+1
            })
          }}
        >
        {
          count > 0 ?
            '不考虑' :
            '不爱'
        }
        </button>
      </div>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'));