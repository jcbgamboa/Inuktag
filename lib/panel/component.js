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
    messages: ['b'], //Array<LinterMessage>,
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
    /*this.props.delegate.onDidChangePanelConfig(() => {
      this.setState({ tempWidth: null })
    })*/
  }
  onClick = (e: MouseEvent, row/*: LinterMessage*/) => {
    console.log("onClick called in component.js");
    // if (process.platform === 'darwin' ? e.metaKey : e.ctrlKey) {
    //   if (e.shiftKey) {
    //     openExternally(row)
    //   } else {
    //     visitMessage(row, true)
    //   }
    // } else {
    //   visitMessage(row)
    // }
  }
  onResize = (event_type, direction: 'left', elem, delta: { width: number, height: number }) => {
    this.setState({ tempWidth: delta.width })
  }
  onResizeStop = (event_type, direction: 'left', elem, size: { width: number, height: number }) => {
    //this.props.delegate.updatePanelWidth(size.width)
  }
  render() {
    const { delegate } = this.props
    const columns = [
      { key: 'severity', label: 'Severity', sortable: true },
      { key: 'linterName', label: 'Provider', sortable: true },
      { key: 'excerpt', label: 'Description', onClick: this.onClick },
      { key: 'line', label: 'Line', sortable: true, onClick: this.onClick },
    ]
    if (delegate.panelRepresents === 'Entire Project') {
      columns.push({ key: 'file', label: 'File', sortable: true, onClick: this.onClick })
    }

    let width
    const customStyle: Object = { overflowY: 'scroll' }
    if (this.state.tempWidth) {
      width = this.state.tempWidth
    } /*else if (delegate.panelTakesMinimumWidth) {
      width = 'auto'
      customStyle.maxWidth = delegate.panelWidth
    } else {
      width = delegate.panelWidth
    }*/
    delegate.setPanelVisibility(/*this.state.visibility && (!delegate.panelTakesMinimumHeight || !!this.state.messages.length)*/true)

    return (
      <ResizableBox enable={{ left: true }} onResize={this.onResize} onResizeStop={this.onResizeStop} height="auto" width={width} style={customStyle}>
        <div id="linter-panel" tabIndex="-1">
          <ReactTable
            rows={this.state.messages}
            columns={columns}

            initialSort={[{ column: 'severity', type: 'desc' }, { column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }]}
            sort={(rows) => rows}//{sortMessages}
            rowKey={i => i.key}

            renderHeaderColumn={i => i.label}
            renderBodyColumn={PanelComponent.renderRowColumn}

            style={{ height: '100%' }}
            className="linter"
          />
        </div>
      </ResizableBox>
    )
  }
  static renderRowColumn(row/*: LinterMessage*/, column: string): string | Object {
    return ['c'];
    // const range = $range(row)
    //
    // switch (column) {
    //   case 'file':
    //     return getPathOfMessage(row)
    //   case 'line':
    //     return range ? `${range.start.row + 1}:${range.start.column + 1}` : ''
    //   case 'excerpt':
    //     if (row.version === 1) {
    //       if (row.html) {
    //         return <span dangerouslySetInnerHTML={{ __html: row.html }} />
    //       }
    //       return row.text || ''
    //     }
    //     return row.excerpt
    //   case 'severity':
    //     return severityNames[row.severity]
    //   default:
    //     return row[column]
    // }
  }
}

module.exports = PanelComponent
