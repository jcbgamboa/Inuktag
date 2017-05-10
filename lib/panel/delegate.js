/* @flow */

import { CompositeDisposable, Disposable, Emitter, Range } from 'atom'
import type { Panel } from 'atom'

//import { filterMessages, filterMessagesByRangeOrPoint } from '../helpers'
//import type { LinterMessage } from '../types'

class PanelDelegate {
  panel: Panel;
  emitter: Emitter;
  messages: Array; //Array<LinterMessage>;
  visibility: boolean;
  subscriptions: CompositeDisposable;
  panelRepresents: 'Entire Project' | 'Current File' | 'Current Line';

  constructor(panel: Panel, dict_data) {
    this.panel = panel
    this.emitter = new Emitter()
    this.messages = dict_data
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.config.observe('linter-ui-default.panelRepresents', (panelRepresents) => {
      const notInitial = typeof this.panelRepresents !== 'undefined'
      this.panelRepresents = panelRepresents
      if (notInitial) {
        this.update()
      }
    }))

    let changeSubscription
    this.subscriptions.add(atom.workspace.observeActivePaneItem((paneItem) => {
      if (changeSubscription) {
        changeSubscription.dispose()
        changeSubscription = null
      }
      this.visibility = atom.workspace.isTextEditor(paneItem)
      this.emitter.emit('observe-visibility', this.visibility)
      if (this.visibility) {
        if (this.panelRepresents !== 'Entire Project') {
          this.update()
        }
        let oldRow = -1
        changeSubscription = paneItem.onDidChangeCursorPosition(({ newBufferPosition }) => {
          if (oldRow !== newBufferPosition.row && this.panelRepresents === 'Current Line') {
            oldRow = newBufferPosition.row
            this.update()
          }
        })
      }
      const shouldUpdate = typeof this.visibility !== 'undefined' && this.panelRepresents !== 'Entire Project'

      if (this.visibility && shouldUpdate) {
        this.update()
      }
    }))
    this.subscriptions.add(new Disposable(function() {
      if (changeSubscription) {
        changeSubscription.dispose()
      }
    }))
  }
  get filteredMessages() {
    /*: Array<LinterMessage> {
    let filteredMessages = []
    if (this.panelRepresents === 'Entire Project') {
      filteredMessages = this.messages
    } else if (this.panelRepresents === 'Current File') {
      const activeEditor = atom.workspace.getActiveTextEditor()
      if (!activeEditor) return []
      filteredMessages = filterMessages(this.messages, activeEditor.getPath())
    } else if (this.panelRepresents === 'Current Line') {
      const activeEditor = atom.workspace.getActiveTextEditor()
      if (!activeEditor) return []
      const activeLine = activeEditor.getCursors()[0].getBufferRow()
      filteredMessages = filterMessagesByRangeOrPoint(this.messages, activeEditor.getPath(), Range.fromObject([[activeLine, 0], [activeLine, Infinity]]))
    }
    return filteredMessages*/
    filteredMessages = this.messages;
    return filteredMessages;
  }
  update(messages/*: ?Array<LinterMessage> = null*/): void {
    if (Array.isArray(messages)) {
      this.messages = messages
    }
    this.emitter.emit('observe-messages', this.filteredMessages)
  }
  onDidChangeMessages(callback: ((messages : Array<LinterMessage>) => any)): Disposable {
    return this.emitter.on('observe-messages', callback)
  }
  onDidChangeVisibility(callback: ((visibility: boolean) => any)): Disposable {
    return this.emitter.on('observe-visibility', callback)
  }
  /*onDidChangePanelConfig(callback: (() => any)): Disposable {
    return this.emitter.on('observe-panel-config', callback)
  }*/
  setPanelVisibility(visibility: boolean): void {
    if (visibility && !this.panel.isVisible()) {
      this.panel.show()
    } /*else if (!visibility && this.panel.isVisible()) {
      this.panel.hide()
    }*/
  }
  dispose() {
    this.subscriptions.dispose()
  }
}

module.exports = PanelDelegate
