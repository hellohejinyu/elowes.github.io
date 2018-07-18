const { PureComponent } = React;

class App extends PureComponent {
  render() {
    return (
      <h1>Hello World</h1>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"));