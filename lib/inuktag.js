'use babel';

import InuktagView from './inuktag-view';
import { CompositeDisposable } from 'atom';

export default {

  inuktagView: null,
  dict_panel: null,
  subscriptions: null,

  activate(state) {
    this.inuktagView = new InuktagView(state.inuktagViewState);
    this.dict_panel = atom.workspace.addRightPanel({
      item: this.inuktagView.getElement(),
      //visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'inuktag:tag_morpheme': () => this.tag_morpheme()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'inuktag:create_mor': () => this.create_mor()
    }));
  },

  deactivate() {
    this.dict_panel.destroy();
    this.subscriptions.dispose();
    this.inuktagView.destroy();
  },

  serialize() {
    return {
      inuktagViewState: this.inuktagView.serialize()
    };
  },

  tag_morpheme() {
    console.log('Inuktag was toggled!');
    return (
      this.dict_panel.isVisible() ?
      this.dict_panel.hide() :
      this.dict_panel.show()
    );
  },

  create_mor() {

  }

};
