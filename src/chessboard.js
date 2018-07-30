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

        this.app = $( selector ).addClass( 'main-container' );
        for (let row = 0; row < rows; row++) {
            const rowHtml = $( '<div>' ).addClass( 'main-container-row' );
            this.app.append( rowHtml );

            for (let col = 0; col < columns; col++) {
                this._boards.push( new Chessboard( `board-${row}-${col}`, rowHtml ) );
            }
        }
    }

    get boards() {
        return this._boards;
    }

    add() {
        const rowHtml = $( '<div>' ).addClass( 'main-container-row' );
        this.app.append( rowHtml );

        const board = new Chessboard( `board-${this._boards.length}`, rowHtml );
        board.fill();
        
        this._boards.push( board );
    }
}


/**
 * The layout created within the parental element:
 *
 * |-------------------------------------|
 * |   flex container with a-h labels    |
 * |-------------------------------------|
 * |   |                             |   |
 * | 1 |                             | 1 |
 * | - |                             | - |
 * | 8 |    board: flex container    | 8 |
 * |   |        with 64 cells,       |   |
 * | l |                             | l |
 * | a |                             | a |
 * | b |        cell classes:        | b |
 * | e |     from 'a1' to 'h8' +     | e |
 * | l |         'even'/'odd'        | l |
 * | s |                             | s |
 * |   |                             |   |
 * |-------------------------------------|
 * |   flex container with a-h labels    |
 * |-------------------------------------|
*/
class Chessboard {

    constructor( id, parent ) {

        this.id = id;

        // DOM creation

        // Board
        const container = $( '<div>' ).addClass( 'board-container' );
        parent.append( container );

        // Sides
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

        // Cells
        this.cells = [];

        this.board = $( `<div id="${id}"> `).addClass( 'board' );
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const location = String.fromCharCode( 0x61 + col ) + (8 - row);
                const cell = $( '<div>' )
                    .addClass( 'cell' )
                    .addClass( location )
                    .addClass( (row + col) % 2 ? 'even' : 'odd' )
                    .append( ' ' );
                cell.get(0).dataset.location = location;
                this.board.append( cell );

                this.cells.push( cell );
            }
        }

        // Moving piece
        this.clickedCell = null;
        this.movingPiece = $( '<div>' )
            .addClass( 'cell' )
            .addClass( 'hidden' )
            .addClass( 'moving' );
        this.board.append( this.movingPiece );

        // put all together into container
        const rowBoard = $( '<div>' ).addClass( 'rowBoard' );

        rowBoard.append( vsideLeft );
        rowBoard.append( this.board );
        rowBoard.append( vsideRight );

        container.append( hsideTop );
        container.append( rowBoard );
        container.append( hsideBottom );

        // EVENT HANDLERS

        this.board.mousemove( e => {
            if (e.buttons === 1 && this.clickedCell) {
                if (this.movingPiece.hasClass( 'hidden' )) {
                    const dataset = this.clickedCell.get(0).dataset;
                    this.movingPiece.get(0).dataset.piece = dataset.piece;
                    this.movingPiece.get(0).dataset.side = dataset.side;
                    this.movingPiece.removeClass( 'hidden' );

                    delete dataset.piece;
                    delete dataset.side;
                }
    
                this.movingPiece.get(0).style.left = (e.clientX - 16) + 'px';
                this.movingPiece.get(0).style.top = (e.clientY - 12) + 'px';
            }
        });

        this.board.mouseup( e => {
            if (this.clickedCell && !this.movingPiece.hasClass( 'hidden' )) {
                this.clickedCell.off( 'mousedown' );

                const dataset = this.movingPiece.get(0).dataset;

                const newCell = e.target.dataset.piece ? this.clickedCell : $( e.target );
                if (newCell.hasClass( 'cell' )) {
                    this.setPiece( newCell.get(0).dataset.location, dataset.piece, dataset.side );
                }

                this.movingPiece.addClass( 'hidden' ); // .text( '' )
                delete dataset.piece;   
                delete dataset.side;
            }

            this.clickedCell = null;
        });
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

    static get pieceLetter() {
        return {
            black: {
                pawn: 'P',
                knight: 'N',
                bishop: 'B',
                rook: 'R',
                queen: 'Q',
                king: 'K',
            },
            white: {
                pawn: 'p',
                knight: 'n',
                bishop: 'b',
                rook: 'r',
                queen: 'q',
                king: 'k',
            },
        };
    }

    static get letterPiece() {
        return {
            P: { piece: 'pawn', side: 'black' },
            N: { piece: 'knight', side: 'black' },
            B: { piece: 'bishop', side: 'black' },
            R: { piece: 'rook', side: 'black' },
            Q: { piece: 'queen', side: 'black' },
            K: { piece: 'king', side: 'black' },
            p: { piece: 'pawn', side: 'white' },
            n: { piece: 'knight', side: 'white' },
            b: { piece: 'bishop', side: 'white' },
            r: { piece: 'rook', side: 'white' },
            q: { piece: 'queen', side: 'white' },
            k: { piece: 'king', side: 'white' },
        };
    }

    get set() { return new SetPieceRequest( this ); }
    get put() { return new SetPieceRequest( this ); }
    get place() { return new SetPieceRequest( this ); }

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

        //el.empty();
        const dataset = el.get(0).dataset;
        delete dataset.piece;
        delete dataset.side;

        for (let id in pieces) {
            el.removeClass( `fa-chess-${pieces[id]}` );
        }
        for (let id in side) {
            el.removeClass( side[id] );
        }

        el.off( 'mousedown' );

        return this;
    }

    setPiece( cell, piece, side ) {
        if (!cell) {
            console.warn( 'no cell ID' ); return this;
        }

        this.clearPiece( cell );

        const el = $( `#${this.id} .${cell}` );
        if (!el) {
            return this;
        }

        const dataset = el.get(0).dataset;

        dataset.piece = piece;
        dataset.side = side;

        el.mousedown( () => {
            this.clickedCell = el;
        });

        el.dblclick( () => {
            this.clearPiece( dataset.location );
        });

        return this;
    }

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

    clear() {
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                this.clearPiece( `${String.fromCharCode( 0x61 + col )}${row + 1}` );
            }
        }

        return this;
    }

    getPiece( cell ) {
        const el = $( `#${this.id} .${cell}` );
        if (!el) {
            return null;
        }

        const data = el.get(0).dataset;
        return {
            piece: data.piece,
            side: data.side,
        };
    }

    move( from, to ) {
        const {piece, side} = this.getPiece( from );

        this.setPiece( to, piece, side );
        this.clearPiece( from );

        return this;
    }

    toString() {
        return this.cells.reduce( (acc, cell) => {
            const { piece, side } = cell.get(0).dataset;
            if (piece) {
                return acc + Chessboard.pieceLetter[ side ][ piece ];
            }
            else {
                return acc + cell.text();
            }
        }, '' );
    }

    fromString( str ) {
        if ( str.length != 64) {
            return false;
        }

        this.clear();

        let index = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const value = str[ index ];

                if (value > 'A' && value < 'z') {
                    const location = this.cells[ index ].get(0).dataset.location;
                    const { piece, side } = Chessboard.letterPiece[ value ];
                    this.setPiece( location, piece, side );
                }

                index++;
            }
        }
    }

    _createHSideCell( cell ) {
        return $( `<div>${String.fromCharCode( 0x61 + cell )}</div>` ).addClass( 'horizontal-cell' );
    }

    _createVSideCell( cell ) {
        return $( `<div>${8 - cell}</div>` ).addClass( 'vertical-cell ');
    }
}

class SetPieceRequest {

    constructor( board ) {
        this.board = board;

        this.side = null;
        this.piece = null;
        this.cell = null;
        
        const self = this;

        for (let side in Chessboard.side) {
            Object.defineProperty( this, Chessboard.side[ side ], {
                get() { 
                    self.side = Chessboard.side[ side ];
                    return self._isValid ? self.board.setPiece( self.cell, self.piece, self.side ) : self;
                },
            });
        }

        for (let piece in Chessboard.piece) {
            Object.defineProperty( this, Chessboard.piece[ piece ], {
                get() { 
                    self.piece = Chessboard.piece[ piece ];
                    return self._isValid ? self.board.setPiece( self.cell, self.piece, self.side ) : self;
                },
            });
        }

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

    get to() { return this; }
    get on() { return this; }

    get _isValid() {
        return this.cell && this.side && this.piece;
    }
}