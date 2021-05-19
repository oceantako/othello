//盤面のデータを格納する2次元配列
let banmen = [];

//色変換を行う方向（下、上、右、左、右下、左下、右上、左上）
const chpatn = [[1,-1,0,0,1,1,-1,-1],[0,0,1,-1,1,-1,1,-1]];

/////画面が読み込まれた際に走る関数/////
window.onload = function(){
    //盤面初期化
    tablecreate();

    //押下可否選択
    click_select();

    //盤面の配列　⇒　テーブル
    banmentotable();

    alert("あなたは黒です");
}

/////テーブルのセルが押下された時の関数/////
function click_table(click_row,click_col) {

    //配列：盤面の色返還を行う
    let black = "black"
    banmenColorChange(click_row,click_col,black);

    //配列：盤面の押下可否を選択する。
    click_select();

    //盤面の配列　⇒　テーブル
    banmentotable();

    //白の置く場所を決定する
    let [whrow,whcol] = whiteAI();

    //白の色変換
    if (whrow != 10 || whcol != 10) {
        let white = "white"
        banmenColorChange(whrow,whcol,white);
    }

    //配列：盤面の押下可否を選択する。
    click_select();

    //盤面の配列　⇒　テーブル（1秒開けて実行）
    /* banmentotable(); */
    setTimeout(banmentotable, 1000);

    setTimeout(KEKKA, 1000);
}

/////盤面の作成と初期化を行う/////
function tablecreate() {
    for (let i = 1; i < 9; i++) {
        $(".othello_table").append("<tr></tr>");
    }
    for (let b = 1; b < 9; b++) {
        $(".othello_table tr").append("<td></td>");
    }
    //盤面多次元配列　何もない⇒0 黒⇒1 白⇒2
    for (let i=0; i<10; i++) {
        banmen[i] = [];
        for (let k=0; k<10; k++){
            banmen[i][k] = 0;
        }
    }
    banmen[4][4] = 1;
    banmen[5][5] = 1;
    banmen[4][5] = 2;
    banmen[5][4] = 2;
}

/////盤面配列をテーブルに転写/////
function banmentotable() {
    for (let i=1; i<9; i++) {
        for (let k=1; k<9; k++){
            let clrow = i -1;
            let clcol = k -1;
            //黒
            if (banmen[i][k] == 1) {
                $(".othello_table tr").eq(clrow).children().eq(clcol).removeClass().addClass("othello_black").text("●");
            }
            //白
            if (banmen[i][k] == 2) {
                $(".othello_table tr").eq(clrow).children().eq(clcol).removeClass().addClass("othello_white").text("●");
            } 
            //押下可能
            if (banmen[i][k] == 5 || banmen[i][k] == 7) {
                $(".othello_table tr").eq(clrow).children().eq(clcol).removeClass().addClass("click_able");
            }
            //押下不可能
            if (banmen[i][k] == 6 || banmen[i][k] == 0) {
                $(".othello_table tr").eq(clrow).children().eq(clcol).removeClass().addClass("click_unable");
            }
        }
    }
}

/////盤面の色変換を行う/////
///引数（押下された座標row,押下された座標col,[black or white]
function banmenColorChange(row,col,borw) {
    let mycolor
    let yourcolor

    if ( borw == "black" ) {
        mycolor = 1;
        yourcolor = 2;
    }else if ( borw == "white" ) {
        mycolor = 2;
        yourcolor =1;
    }

    //押下された場所の色変換
    banmen[row][col] = mycolor;

    //押下された場所以外の色返還を行う
    for (let i=0; i<8; i++) {
        //検査方向に白がある限り進む
        let rowway = chpatn[0][i];
        let colway = chpatn[1][i];
        while (banmen[row + rowway][col + colway] == yourcolor) {
            rowway = rowway + chpatn[0][i];
            colway = colway + chpatn[1][i];
        }
        //白がなくなった時点で次の色が黒であれば色を変換
        if (banmen[row + rowway][col + colway] == mycolor ) {
            let changerow = row;
            let changecol = col;
            while (changerow + chpatn[0][i] != row + rowway || changecol + chpatn[1][i] != col + colway) {
                changerow = changerow + chpatn[0][i];
                changecol = changecol + chpatn[1][i];

                banmen[changerow][changecol] = mycolor;
            }
        }
    }
}

/////盤面から押下不能の箇所をセレクトする/////
function click_select() {
    for (let r = 1; r < 9; r++) {
        for (let c = 1; c < 9; c++) {
            //すでに白か黒ならそのまま
            if (banmen[r][c] == 1 || banmen[r][c] == 2) {
                continue;
            }

            //白・黒以外すべてを一旦押下不可にする
            banmen[r][c] = 0;

            //押下可否検証開始
            //bw ⇒ この色を検証する（1:黒2:白）
            for (let bw = 1; bw < 3; bw++) {
                let bw_gyaku = 1
                if ( bw == 1) { bw_gyaku = 2; }
                //方向の選択の繰り返し
                for (let i = 0; i < 8; i++) {
                    let bool = false;
                    let rowplus = chpatn[0][i];
                    let colplus = chpatn[1][i];
                    //逆の色がある限り進む
                    while ( banmen[r + rowplus][c + colplus] == bw_gyaku) {
                        rowplus = rowplus + chpatn[0][i];
                        colplus = colplus + chpatn[1][i];
                        bool = true;
                    }
                    //同じ色で挟まれていれば
                    if (banmen[r + rowplus][c + colplus] == bw && bool == true) {
                        //黒のみ可能
                        if (bw == 1) { banmen[r][c] = 5; }
                        //白のみ可能
                        else if ( bw == 2 && banmen[r][c] == 0 ) { banmen[r][c] = 6;}
                        //どちらも可能
                        else if ( bw == 2 && banmen[r][c] == 5 ) { banmen[r][c] = 7;}
                        break;
                    }
                }
            }
        }
    }
}

/////配列：盤面から白が有利になる箇所を選択する/////
//戻り値[row.colum]
function whiteAI() {
    if (banmen[1][1] == 6 || banmen[1][1] == 7) {
        return [1,1]
    }
    if (banmen[1][8] == 6 || banmen[1][8] == 7) {
        return [1,8]
    }
    if (banmen[8][8] == 6 || banmen[8][8] == 7) {
        return [8,8]
    }
    if (banmen[8][1] == 6 || banmen[8][1] == 7) {
        return [8,1]
    }

    let canban = [[],[]];
    for (let n = 3; n < 7; n++) {
        if (banmen[n][1] == 6 || banmen[n][1] == 7) {
            let a = canban[0].length;
            canban[0][a] = n;
            canban[1][a] = 1;
        }
        if (banmen[n][8] == 6 || banmen[n][8] == 7) {
            let a = canban[0].length;
            canban[0][a] = n;
            canban[1][a] = 8;
        }
        if (banmen[1][n] == 6 || banmen[1][n] == 7) {
            let a = canban[0].length;
            canban[0][a] = 1;
            canban[1][a] = n;
        }
        if (banmen[8][n] == 6 || banmen[8][n] == 7) {
            let a = canban[0].length;
            canban[0][a] = 8;
            canban[1][a] = n;
        }
    }
    if (canban[0].length > 0) {
        let math = canban[0].length;
        let ran = Math.floor( Math.random() * math );
        let retrow = canban[0][ran];
        let retcol = canban[1][ran];
        return [retrow,retcol];
    }

    if (banmen[6][6] == 6 || banmen[6][6] == 7) {
        return [6,6];
    }
    if (banmen[3][3] == 6 || banmen[3][3] == 7) {
        return [3,3];
    }
    if (banmen[3][6] == 6 || banmen[3][6] == 7) {
        return [3,6];
    }
    if (banmen[6][3] == 6 || banmen[6][3] == 7) {
        return [6,3];
    }

    let canban2 = [[],[]];
    for (let r = 1; r < 9; r++) {
        for (let c = 1; c < 9; c++) {
            if (banmen[r][c] == 6 || banmen[r][c] == 7) {
                let a = canban[0].length;
                canban[0][a] = r;
                canban[1][a] = c;
            }
        }
    }
    if (canban[0].length > 0) {
        let math = canban[0].length;
        let ran = Math.floor( Math.random() * math );
        let retrow = canban[0][ran];
        let retcol = canban[1][ran];
        return [retrow,retcol];
    }

    return[10,10];


}

function KEKKA() {
    let end_jag
    for (let i = 1; i < 9; i++) {
        end_jag = banmen[i].some(e => e > 3);
        if ( end_jag == true) { return; }
    }
    if ( end_jag == false ) {
        alert("ゲームが終了しました")
        let black_counter = 0;
        let white_counter = 0;
        for (let i = 1; i < 9; i++) {
            let black_j = banmen[i].filter(b => b === 1);
            let white_j = banmen[i].filter(w => w === 2);
            black_counter = black_counter + black_j.length;
            white_counter = white_counter + white_j.length;
        }
        let texttest = "黒" + black_counter + "白" + white_counter;
        alert(texttest);
    }
}


function tanaka() {
    $(".othello_table").empty();
    //盤面初期化
    tablecreate();

    //押下可否選択
    click_select();

    //盤面の配列　⇒　テーブル
    banmentotable();
    alert("あなたは黒です");
}