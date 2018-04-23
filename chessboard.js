/**
 * The layout created within the parental element:
 *
 * |--------------------------------------------------------------------------------------
 * |                                        row
 * |  |-------------------------------------|  |-------------------------------------|  |-
 * |  |   flex container with a-f labels    |  |   flex container with a-f labels    |  |
 * |  |-------------------------------------|  |-------------------------------------|  |-
 * |  |   |                             |   |  |   |                             |   |  |
 * |  | 1 |                             | 1 |  | 1 |                             | 1 |  |
 * |  | - |                             | - |  | - |                             | - |  |
 * |  | 9 |                             | 9 |  | 9 |                             | 9 |  |
 * |  |   |    board: flex container    |   |  |   |    board: flex container    |   |  |
 * |  | l |                             | l |  | l |                             | l |  |
 * |  | a |        with 64 cells        | a |  | a |        with 64 cells        | a |  |
 * |  | b |                             | b |  | b |                             | b |  |
 * |  | e |                             | e |  | e |                             | e |  |
 * |  | l |                             | l |  | l |                             | l |  |
 * |  | s |                             | s |  | s |                             | s |  |
 * |  |   |                             |   |  |   |                             |   |  |
 * |  |-------------------------------------|  |-------------------------------------|  |-
 * |  |   flex container with a-f labels    |  |   flex container with a-f labels    |  |
 * |  |-------------------------------------|  |-------------------------------------|  |-
 * |
 * |--------------------------------------------------------------------------------------
 * |                                        row
*/

class Chessboards {

    constructor( selector, columns, rows ) {

        this._boards = [];

        const app = $(selector).addClass('main-container');
        for (let row = 0; row < rows; row++) {
            const rowHtml = $('<div>').addClass('main-container-row');
            app.append( rowHtml );

            for (let col = 0; col < columns; col++) {
                this._boards.push( new Chessboard( `board-${row}-${col}`, rowHtml ) );
            }
        }
    }

    get boards() {
        return this._boards;
    }
}


class Chessboard {

    constructor( id, parent ) {

        this.id = id;

        const container = $('<div>').addClass('board-container');
        parent.append( container );

        const hsideTop = $('<div>').addClass('h-side');
        const hsideBottom = $('<div>').addClass('h-side');
        for (let i = 0; i < 8; i++) {
            hsideTop.append( this._createHSideCell( i ) );
            hsideBottom.append( this._createHSideCell( i ) );
        }

        const vsideLeft = $('<div>').addClass('v-row');
        const vsideRight = $('<div>').addClass('v-row');
        for (let i = 0; i < 8; i++) {
            vsideLeft.append( this._createVSideCell( i ) );
            vsideRight.append( this._createVSideCell( i ) );
        }

        const board = $(`<div id="${id}">`).addClass('board');
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                board.append( $('<i>')
                    .addClass( 'cell' )
                    .addClass( 'fas' )
                    .addClass( String.fromCharCode(0x61 + col) + (8 - row) )
                    .addClass( (row + col) % 2 ? 'even' : 'odd' )
                );
            }
        }

        const rowBoard = $('<div>').addClass('rowBoard');

        rowBoard.append( vsideLeft );
        rowBoard.append( board );
        rowBoard.append( vsideRight );

        container.append( hsideTop );
        container.append( rowBoard );
        container.append( hsideBottom );
    }

    static get pieces() {
        return {
            pawn: 'pawn',
            knight: 'knight',
            bishop: 'bishop',
            rook: 'rook',
            queen: 'queen',
            king: 'king',
        };
    }

    static get side() {
        return {
            white: 'white',
            black: 'black',
        };
    }

    setPiece( cellID, pieceID, sideID ) {
        const piece = $( `#${this.id} .${cellID}` );
        if (pieceID) {
            piece.addClass( sideID ).addClass( `fa-chess-${pieceID}` );
        }
        else {
            piece.removeClass( `fa-chess-${pieceID}-alt` );
        }
    }

    _createHSideCell( cellID ) {
        return $(`<div>${String.fromCharCode(0x61 + cellID)}</div>`).addClass('horizontal-cell');
    }

    _createVSideCell( cellID ) {
        return $(`<div>${8 - cellID}</div>`).addClass('vertical-cell');
    }
}
