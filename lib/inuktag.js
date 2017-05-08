'use babel';

import InuktagView from './inuktag-view';
import { CompositeDisposable } from 'atom';

const fs = require("fs");
const path = require('path')

import provider from './provider'

/*
export default {
    getProvider() {
        // return a single provider, or an array of providers to use together
        return [provider];
    }
};
*/
export default {
  inuktagView: null,
  dict_panel: null,
  dict_data: null,
  subscriptions: null,

  activate(state) {
    //var dict_data = fs.readFileSync('dict.txt', {flag:'r'});
    let dict_file_path = path.resolve(__dirname, 'data', 'dict.txt')
    dict_data = this.parse_dict_data(dict_file_path);

    this.inuktagView = new InuktagView(state.inuktagViewState);
    this.dict_panel = atom.workspace.addRightPanel({
      item: this.inuktagView.getElement(),
      visible: true
    });

    // Initializes the provider
    provider.load(dict_data)

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'inuktag:tag_morpheme': () => this.tag_morpheme()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'inuktag:create_mor': () => this.create_mor()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'inuktag:toggle_dict_panel': () => this.toggle_dict_panel()
    }));
  },

  getProvider() {
    return [provider];
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
  },

  create_mor() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      if (editor.hasMultipleCursors())
        // Doing anything here would be a little dangerous
        return;

      // Reads the current line
      let curr_point = editor.getCursorBufferPosition();
      let curr_line = editor.lineTextForBufferRow(curr_point.row);

      // Removes the indication of who spoke the current line (replaces it with
      // "%mor:").
      let curr_line_content = curr_line.split('\t')
      if (curr_line_content.length != 2)
        // The idea is that, if the line has no '\t', then this function is
        // probably being called in the wrong place
        return;

      let mor_line = "%xmor:\t" + curr_line_content[1];

      // Puts the %mor tier after the %eng tier (which always appears after the
      // main tier).
      editor.moveDown();
      editor.insertNewlineBelow();
      editor.insertText(mor_line, {
        select: false,
        autoIndent: false,
        autoIndentNewline: false,
      });
    }
  },

  toggle_dict_panel() {
    return (
      this.dict_panel.isVisible() ?
      this.dict_panel.hide() :
      this.dict_panel.show()
    );
  },

  parse_dict_data(file_path) {
    // I assume the dictionary contains either "content" lines, or
    // "comment" lines (beginning with ";"). I manually removed all empty lines
    // from the file, as well as the first line (that contained just garbage).
    //
    // I assume also that the dictionary is very small and I can be inneficient.
    //
    // Question: can the dictionary, at least, be free? (I assume it can't)
    let dict_data = [];
    let dict_lines = [];
    let dict_file_lines = fs.readFileSync(file_path).toString().split("\n");

    // Eliminates comment lines
    for (i = 0; i < dict_file_lines.length; i++) {
      if (!(dict_file_lines[i].startsWith(';')) &&
          !(dict_file_lines[i] === '')) {
        dict_lines.push(dict_file_lines[i]);
      }
    }

    // Parses the remaining (content) lines
    for (i = 0; i < dict_lines.length; i++) {
      dict_data.push(this.parse_row(dict_lines[i]));
    }

    console.log(dict_data);

    return dict_data;
  },

  parse_row(line) {
    // Each line in the dictionary follows the syntax:
    //
    // <one_or_more_words_separeted_by_underscore> <morpheme_description>
    //
    // They are divided by a whitespace. Whatever is left of the whitespace is
    // the word; whatever is right of the whitespace is the morpheme. I am
    // assuming there is no other whitespace in the line.

    //[surface_form, morpheme_description] = line.split(' ');
    return line.split(' ');
  }
};
//*/
