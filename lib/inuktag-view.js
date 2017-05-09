'use babel';

const Interact = require('interact.js');
// var $ = require( 'jquery' );
// var dt = require( 'datatables.net' )();

export default class InuktagView {

  constructor(dict_data) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('inuktag');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The Inuktag package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);

    //this.element.appendChild(this.create_table(dict_data));

    // Strongly inspired by:
    // https://github.com/steelbrain/linter/blob/1a81cb95db7dde7013f3603448269489df5f930e/lib/ui/bottom-panel.js
    // (this makes the right panel resizeable)
    Interact(this.element).resizable({edges: { left: true }})
      .on('resizemove', function (event) {
        var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0),
          y = (parseFloat(target.getAttribute('data-y')) || 0)

        if (event.rect.height < 30) {
          return // No-Op
        }

        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        x += event.deltaRect.left
        y += event.deltaRect.top

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      })
  }

  // create_table(dict_data) {
  //   // This is probably a very ugly way of inserting all the data into a table;
  //   // unfortunately, it was the only way I managed to get it to work =/
  //   // TODO: Make this in a better way
  //   const table = document.createElement('table');
  //   table.classList.add('display');
  //   table.id = 'tags_table'
  //   table.cellspacing = '0'
  //   table.width = '100%'
  //
  //   const header = table.createTHead();
  //   let hrow = header.insertRow(0);
  //   let hcell2 = hrow.insertCell(0);
  //   let hcell1 = hrow.insertCell(1);
  //   hcell1.innerHTML = "Tag";
  //   hcell2.innerHTML = "Gloss";
  //
  //   for (i = 0; i < dict_data.length; i++) {
  //     let row = table.insertRow(0);
  //     let cell1 = row.insertCell(0);
  //     let cell2 = row.insertCell(1);
  //     cell1.innerHTML = dict_data[i][0];
  //     cell2.innerHTML = dict_data[i][1];
  //   }
  //   $('#tags_table').DataTable();
  //   return table;
  // }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }


}
