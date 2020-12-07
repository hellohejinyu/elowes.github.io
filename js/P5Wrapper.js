'use strict'

const _createClass = (function () { function defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor } })()

const _get = function get (_x, _x2, _x3) { let _again = true; _function: while (_again) { let object = _x; const property = _x2; const receiver = _x3; _again = false; if (object === null) object = Function.prototype; let desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { let parent = Object.getPrototypeOf(object); if (parent === null) { return undefined } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function } } else if ('value' in desc) { return desc.value } else { const getter = desc.get; if (getter === undefined) { return undefined } return getter.call(receiver) } } }

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass) } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass }

const _react = React

const _react2 = _interopRequireDefault(_react)

const _p5 = p5

const _p52 = _interopRequireDefault(_p5)

const P5Wrapper = (function (_React$Component) {
  _inherits(P5Wrapper, _React$Component)

  function P5Wrapper () {
    _classCallCheck(this, P5Wrapper)

    _get(Object.getPrototypeOf(P5Wrapper.prototype), 'constructor', this).apply(this, arguments)
  }

  _createClass(P5Wrapper, [{
    key: 'componentDidMount',
    value: function componentDidMount () {
      this.canvas = new _p52.default(this.props.sketch, this.wrapper)
      if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
        this.canvas.myCustomRedrawAccordingToNewPropsHandler(this.props)
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps (newprops) {
      if (this.props.sketch !== newprops.sketch) {
        this.wrapper.removeChild(this.wrapper.childNodes[0])
        this.canvas = new _p52.default(newprops.sketch, this.wrapper)
      }
      if (this.canvas.myCustomRedrawAccordingToNewPropsHandler) {
        this.canvas.myCustomRedrawAccordingToNewPropsHandler(newprops)
      }
    }
  }, {
    key: 'render',
    value: function render () {
      const _this = this

      return _react2.default.createElement('div', {
        ref: function (wrapper) {
          return _this.wrapper = wrapper
        }
      })
    }
  }])

  return P5Wrapper
})(_react2.default.Component)

export default P5Wrapper
