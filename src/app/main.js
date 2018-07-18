import ResumeData from './data.json'

class DataExtend {
  constructor() {}

  extend(destination, source) {
    for (let prop in source) {
      if (!source.hasOwnProperty(prop)) {
        continue
      }
      destination[prop] = source[prop]
    }
  }
}

class ActionEvent {
  static get $inject() {
    return ['$window']
  }
  constructor($window) {
    let isSupportTouch = 'ontouchend' in $window.document,
      actionEvent

    actionEvent = {
      start: isSupportTouch ? 'touchstart' : 'mousedown',
      move: isSupportTouch ? 'touchmove' : 'mousemove',
      end: isSupportTouch ? 'touchend' : 'mouseup',
      wheel: 'mousewheel'
    }
    this.event = actionEvent
  }
}
export default angular.module('appServices', []).constant('resumeData', ResumeData)
// .service('actionEvent', ActionEvent)
// .service('stopIosDropDown', stopIosDropDown)
// .service('dataExtend', dataExtend)
// .service('initArrow', InitArrow)
