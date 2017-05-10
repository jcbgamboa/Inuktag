/* @flow */

import { CompositeDisposable, Disposable, Emitter, Range } from 'atom'
import type { Panel } from 'atom'

class PanelDelegate {
  panel: Panel;
  emitter: Emitter;
  messages: Array;
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
  setPanelVisibility(visibility: boolean): void {
    if (visibility && !this.panel.isVisible()) {
      this.panel.show()
    }
  }
  dispose() {
    this.subscriptions.dispose()
  }
}

module.exports = PanelDelegate
