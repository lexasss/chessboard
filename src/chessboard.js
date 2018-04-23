/**
 * The layout created within the parental element:
 *
 * |---------------------------------------
 * |         vertical flex container
 * |  |-------------|  |-------------|  |--
 * |  |             |  |             |  |
 * |  |             |  |             |  |
 * |  |    board    |  |    board    |  |
 * |  |             |  |             |  |
 * |  |             |  |             |  |
 * |  |-------------|  |-------------|  |--
 * |
 * |---------------------------------------
 * |         vertical flex container
 * |  |-------------|  |-------------|  |--
 * |  |             |  |             |  |
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


/**
 * The layout created within the parental element:
 *
 * |-------------------------------------|
 * |   flex container with a-f labels    |
 * |-------------------------------------|
 * |   |                             |   |
 * | 1 |                             | 1 |
 * | - |                             | - |
 * | 9 |    board: flex container    | 9 |
 * |   |        with 64 cells,       |   |
 * | l |                             | l |
 * | a |                             | a |
 * | b |        cell classes:        | b |
 * | e |     from 'a1' to 'h8' +     | e |
 * | l |         'even'/'odd'        | l |
 * | s |                             | s |
 * |   |                             |   |
 * |-------------------------------------|
 * |   flex container with a-f labels    |
 * |-------------------------------------|
*/
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

    static get piece() {
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

    clearPiece( cellID ) {
        const cell = $( `#${this.id} .${cellID}` );
        const pieces = Chessboard.piece;
        const side = Chessboard.side;

        for (let id in pieces) {
            cell.removeClass( `fa-chess-${pieces[id]}` );
        }
        for (let id in side) {
            cell.removeClass( side[id] );
        }

        return this;
    }

    setPiece( cellID, pieceID, sideID ) {

        this.clearPiece( cellID );

        $( `#${this.id} .${cellID}` )
            .addClass( sideID )
            .addClass( `fa-chess-${pieceID}` );

        return this;
    }

    fill() {
        for (let i = 0; i < 8; i++) {
            this.setPiece( `${String.fromCharCode(0x61 + i)}2`, Chessboard.piece.pawn, Chessboard.side.white );
            this.setPiece( `${String.fromCharCode(0x61 + i)}7`, Chessboard.piece.pawn, Chessboard.side.black );
        }

        this.setPiece( `a1`, Chessboard.piece.rook, Chessboard.side.white );
        this.setPiece( `b1`, Chessboard.piece.knight, Chessboard.side.white );
        this.setPiece( `c1`, Chessboard.piece.bishop, Chessboard.side.white );
        this.setPiece( `d1`, Chessboard.piece.queen, Chessboard.side.white );
        this.setPiece( `e1`, Chessboard.piece.king, Chessboard.side.white );
        this.setPiece( `f1`, Chessboard.piece.bishop, Chessboard.side.white );
        this.setPiece( `g1`, Chessboard.piece.knight, Chessboard.side.white );
        this.setPiece( `h1`, Chessboard.piece.rook, Chessboard.side.white );

        this.setPiece( `a8`, Chessboard.piece.rook, Chessboard.side.black );
        this.setPiece( `b8`, Chessboard.piece.knight, Chessboard.side.black );
        this.setPiece( `c8`, Chessboard.piece.bishop, Chessboard.side.black );
        this.setPiece( `d8`, Chessboard.piece.queen, Chessboard.side.black );
        this.setPiece( `e8`, Chessboard.piece.king, Chessboard.side.black );
        this.setPiece( `f8`, Chessboard.piece.bishop, Chessboard.side.black );
        this.setPiece( `g8`, Chessboard.piece.knight, Chessboard.side.black );
        this.setPiece( `h8`, Chessboard.piece.rook, Chessboard.side.black );

        return this;
    }

    clear() {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this.clearPiece( `${String.fromCharCode(0x61 + col)}${row + 1}` );
            }
        }

        return this;
    }

    _createHSideCell( cellID ) {
        return $(`<div>${String.fromCharCode(0x61 + cellID)}</div>`).addClass('horizontal-cell');
    }

    _createVSideCell( cellID ) {
        return $(`<div>${8 - cellID}</div>`).addClass('vertical-cell');
    }
}
