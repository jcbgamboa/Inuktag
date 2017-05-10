/* @flow */

import React from 'react'
import ReactDOM from 'react-dom'
import { CompositeDisposable, Disposable } from 'atom'

import Delegate from './delegate'
import Component from './component'

class Panel {
  delegate: Delegate;
  subscriptions: CompositeDisposable;

  constructor(dict_data) {
    this.subscriptions = new CompositeDisposable()

    const element = document.createElement('div')
    const panel = atom.workspace.addRightPanel({
      item: element,
      visible: true,
      priority: 500,
    })
    this.subscriptions.add(new Disposable(function() {
      panel.destroy()
    }))

    this.delegate = new Delegate(panel, dict_data)
    this.subscriptions.add(this.delegate)

    ReactDOM.render(<Component delegate={this.delegate} />, element)
  }
  update(messages): void {
    this.delegate.update(messages)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}

module.exports = Panel
