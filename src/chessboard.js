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

    /**
     * @constructor Constructor with 1 or 3 arguments
     * @param {string} selector 
     * @param {number} [columns]
     * @param {number} [rows]
     */
    constructor( selector, columns, rows ) {

        /** @type {Chessboard[]} */
        this._boards = [];
        this._app = $(selector);

        if (columns && rows) {
            this._app.addClass('main-container');
            for (let row = 0; row < rows; row++) {
                const rowHtml = $('<div>').addClass('main-container-row');
                this._app.append( rowHtml );
    
                for (let col = 0; col < columns; col++) {
                    this._boards.push( new Chessboard( `board-${row}-${col}`, rowHtml ) );
                }
            }
        }
        else {
            this._app.addClass('main-container-long');
        }
    }

    /**
     * @description returns the list of boards
     * @returns {Chessboard[]} the list of boards
     */
    get boards() {
        return this._boards;
    }

    /**
     * @description adds a new board
     * @returns {Chessboard} newly created board
     */
    add() {
        const board = new Chessboard( `board-${this._boards.length}`, this._app );
        this._boards.push( board );
        return board;
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

    /**
     * @constructor
     * @param {string} id 
     * @param {*} $parent jQuery container
     */
    constructor( id, $parent ) {

        this.id = id;

        this._container = $( '<div>' ).addClass( 'board-container' );
        $parent.append( this._container );

        // frame with labels
        const hsideTop = $( '<div>' ).addClass( 'h-side' );
        const hsideBottom = $( '<div> ').addClass( 'h-side' );
        for (let i = 0; i < 8; i++) {
            hsideTop.append( this._createHSideCell( i ) );
            hsideBottom.append( this._createHSideCell( i ) );
        }

        const vsideLeft = $(' <div>' ).addClass( 'v-row' );
        const vsideRight = $( '<div>' ).addClass( 'v-row' );
        for (let i = 0; i < 8; i++) {
            vsideLeft.append( this._createVSideCell( i ) );
            vsideRight.append( this._createVSideCell( i ) );
        }

        // cells
        const board = $( `<div id="${id}"> `).addClass( 'board' );
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                board.append( $( '<i>' )
                    .addClass( 'cell' )
                    .addClass( 'fas' )
                    .addClass( String.fromCharCode( 0x61 + col ) + (8 - row) )
                    .addClass( (row + col) % 2 ? 'even' : 'odd' )
                );
            }
        }

        // putting all stuff together
        const rowBoard = $( '<div>' ).addClass( 'rowBoard' );

        rowBoard.append( vsideLeft );
        rowBoard.append( board );
        rowBoard.append( vsideRight );

        this._container.append( hsideTop );
        this._container.append( rowBoard );
        this._container.append( hsideBottom );
    }

    /** @description list of pieces */
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

    /** @description list of sides */
    static get side() {
        return {
            white: 'white',
            black: 'black',
        };
    }

    /**
     * @description clears a piece from the cell if any
     * @param {string} cell 
     */
    clearPiece( cell ) {
        if (!cell) {
            console.warn( 'no cell ID' ); return this;
        }

        const el = $( `#${this.id} .${cell}` );
        if (!el) {
            console.warn( `cell ${cell} does not exist` ); return this;
        }
        
        const pieces = Chessboard.piece;
        const side = Chessboard.side;

        for (let id in pieces) {
            el.removeClass( `fa-chess-${pieces[id]}` );
        }
        for (let id in side) {
            el.removeClass( side[id] );
        }

        return this;
    }

    /**
     * @description set the piece to the cell
     * @param {string} cell 
     * @param {string} piece 
     * @param {string} side 
     */
    setPiece( cell, piece, side ) {
        if (!cell) {
            console.warn( 'no cell ID' ); return this;
        }

        this.clearPiece( cell );

        const el = $( `#${this.id} .${cell}` );
        if (!el) {
            return this;
        }
        
        el.addClass( side )
            .addClass( `fa-chess-${piece}` );

        return this;
    }

    /** @description fill the board with initial setup */
    fill() {
        const p = Chessboard.piece;
        const s = Chessboard.side;

        for (let i = 0; i < 8; i++) {
            this.setPiece( `${String.fromCharCode( 0x61 + i )}2`, p.pawn, s.white );
            this.setPiece( `${String.fromCharCode( 0x61 + i )}7`, p.pawn, s.black );
        }

        this.setPiece( `a1`, p.rook, s.white );
        this.setPiece( `b1`, p.knight, s.white );
        this.setPiece( `c1`, p.bishop, s.white );
        this.setPiece( `d1`, p.queen, s.white );
        this.setPiece( `e1`, p.king, s.white );
        this.setPiece( `f1`, p.bishop, s.white );
        this.setPiece( `g1`, p.knight, s.white );
        this.setPiece( `h1`, p.rook, s.white );

        this.setPiece( `a8`, p.rook, s.black );
        this.setPiece( `b8`, p.knight, s.black );
        this.setPiece( `c8`, p.bishop, s.black );
        this.setPiece( `d8`, p.queen, s.black );
        this.setPiece( `e8`, p.king, s.black );
        this.setPiece( `f8`, p.bishop, s.black );
        this.setPiece( `g8`, p.knight, s.black );
        this.setPiece( `h8`, p.rook, s.black );

        return this;
    }

    /** @description clears the board */
    clear() {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this.clearPiece( `${String.fromCharCode( 0x61 + col )}${row + 1}` );
            }
        }

        return this;
    }

    // properties that serve for making a chain of properties when setting a piece to a cell
    
    /** @returns {SetPieceRequest} */
    get set() { return new SetPieceRequest( this ); }
    /** @returns {SetPieceRequest} */
    get put() { return new SetPieceRequest( this ); }
    /** @returns {SetPieceRequest} */
    get place() { return new SetPieceRequest( this ); }

    _createHSideCell( cell ) {
        return $( `<div>${String.fromCharCode( 0x61 + cell )}</div>` ).addClass( 'horizontal-cell' );
    }

    _createVSideCell( cell ) {
        return $( `<div>${8 - cell}</div>` ).addClass( 'vertical-cell ');
    }
}

/**
 * @description enables setting pieces in a way like "board.set.white.king.to.e1"
 */
class SetPieceRequest {

    /**
     * @constructor
     * @param {Chessboard} board 
     */
    constructor( board ) {
        this.board = board;

        this.side = null;
        this.piece = null;
        this.cell = null;
        
        const self = this;

        // enables sides in the chain
        for (let side in Chessboard.side) {
            Object.defineProperty( this, Chessboard.side[ side ], {
                get() { 
                    self.side = Chessboard.side[ side ];
                    return self._isValid ? self.board.setPiece( self.cell, self.piece, self.side ) : self;
                },
            });
        }

        // enables pieces in the chain
        for (let piece in Chessboard.piece) {
            Object.defineProperty( this, Chessboard.piece[ piece ], {
                get() { 
                    self.piece = Chessboard.piece[ piece ];
                    return self._isValid ? self.board.setPiece( self.cell, self.piece, self.side ) : self;
                },
            });
        }

        // enables cell ids in the chain
        for (let c = 0; c < 8; c++) {
            for (let n = 0; n < 8; n++) {
                const cell = String.fromCharCode( 0x61 + c ) + (n + 1);
                Object.defineProperty( this, cell, {
                    get() { 
                        self.cell = cell;
                        return self._isValid ? self.board.setPiece( self.cell, self.piece, self.side ) : self;
                    },
                });
            }
        }
    }

    /** 
     * @description enables "to" in the request chain
     * @returns {SetPieceRequest}
     */
    get to() { return this; }

    /** 
     * @description enables "on" in the request chain
     * @returns {SetPieceRequest}
     */
    get on() { return this; }

    get _isValid() {
        return this.cell && this.side && this.piece;
    }
}