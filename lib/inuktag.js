'use babel';

import InuktagView from './inuktag-view';
import { CompositeDisposable } from 'atom';

export default {

  inuktagView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.inuktagView = new InuktagView(state.inuktagViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.inuktagView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'inuktag:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.inuktagView.destroy();
  },

  serialize() {
    return {
      inuktagViewState: this.inuktagView.serialize()
    };
  },

  toggle() {
    console.log('Inuktag was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
