/* @flow */

import React from 'react'
import ReactTable from 'sb-react-table'
import ResizableBox from 'react-resizable-box'
//import { $range, severityNames, sortMessages, visitMessage, openExternally, getPathOfMessage } from '../helpers'
import type Delegate from './delegate'
//import type { LinterMessage } from '../types'

class PanelComponent extends React.Component {
  props: {
    delegate: Delegate,
  };
  state: {
    messages: Array,
    visibility: boolean,
    tempWidth: ?number,
  };
  constructor(props: Object, context: ?Object) {
    super(props, context)
    this.state = {
      messages: this.props.delegate.filteredMessages,
      visibility: this.props.delegate.visibility,
      tempWidth: null,
    }
  }
  componentDidMount() {
    this.props.delegate.onDidChangeMessages((messages) => {
      this.setState({ messages })
    })
    this.props.delegate.onDidChangeVisibility((visibility) => {
      this.setState({ visibility })
    })
  }
  onClick = (e: MouseEvent, row/*: LinterMessage*/) => {
  }
  onResize = (event_type, direction: 'left', elem, delta: { width: number, height: number }) => {
    this.setState({ tempWidth: delta.width })
  }
  render() {
    const { delegate } = this.props
    const columns = [
      { key: 'morpheme', label: 'Morpheme', sortable: true },
      { key: 'gloss', label: 'Gloss', sortable: true },
    ]

    let width
    const customStyle: Object = { overflowY: 'scroll', overflowX: 'scroll' }
    if (this.state.tempWidth) {
      width = this.state.tempWidth
    }
    delegate.setPanelVisibility(/*this.state.visibility && (!delegate.panelTakesMinimumHeight || !!this.state.messages.length)*/true)

    return (
      <ResizableBox enable={{ left: true, bottom: true }} onResize={this.onResize} height="auto" width={width} style={customStyle}>
        <div id="linter-panel" tabIndex="-1">
          <ReactTable
            rows={this.state.messages}
            columns={columns}

            initialSort={[{ column: 'morpheme', type: 'desc' }, { column: 'gloss', type: 'desc' }]}
            sort={(rows) => rows}//{sortMessages}
            rowKey={i => i[1]}

            renderHeaderColumn={i => i.label}
            renderBodyColumn={PanelComponent.renderRowColumn}

            style={{ width: '100%' }}
            className="linter"
          />
        </div>
      </ResizableBox>
    )
  }
  static renderRowColumn(row/*: LinterMessage*/, column: string): string | Object {
    switch (column) {
      case 'morpheme':
        return row[0];
      case 'gloss':
        return row[1];
      default:
        return 'a';
    }
  }
}

module.exports = PanelComponent
