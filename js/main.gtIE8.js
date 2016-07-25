'use strict';
// В ЭТОМ СКРИПТЕ ПРОБЛЕМЫ С СОВМЕСТИМОСТЮ С IE8-

// различные сообщения
var MESSAGES = {
    WRONG_SIZES: "Такие матрицы нельзя перемножить, так как  количество столбцов матрицы А не равно количеству строк матрицы B.",
    WRONG_MATRIX: "Матрица не правильно заполнена."
},
    MAX_VALUE = 10, // максимальное значение ячейки
    MIN_VALUE = -10, // минимальое значение ячейки
    MAX_MX_SIZE = 10, // максимальный порядок матрицы
    MIN_MX_SIZE = 2; // минимальный порядок матрицы

var menu = document.getElementById("menu"), // блок меню с кнопками
    messageBox = document.getElementById("message"); // поле для вывода сообщений

// создадим необходимые нам матрицы
// матрицу А
var mxWrapperA = document.getElementById("mx-wrapper-A"),
        mxObjA = new MatrixObject({
        name: 'a',
        width: 2,
        height: 4,
        maxValue: MAX_VALUE,
        minValue: MIN_VALUE,
        maxSize: MAX_MX_SIZE,
        minSize: MIN_MX_SIZE,
        numeric: true
    });
mxObjA.appendToBeginOf(mxWrapperA);

// матрицу B
var mxWrapperB = document.getElementById("mx-wrapper-B"),
    mxObjB = new MatrixObject({
        name: 'b',
        width: 3,
        height: 2,
        maxValue: MAX_VALUE,
        minValue: MIN_VALUE,
        maxSize: MAX_MX_SIZE,
        minSize: MIN_MX_SIZE,
        numeric: true
    });
mxObjB.appendToBeginOf(mxWrapperB);

// матрицу C
var mxWrapperC = document.getElementById("mx-wrapper-C"),
    mxObjC = new MatrixObject({
        name: 'c',
        width: 3,
        height: 4,
        maxValue: MAX_VALUE,
        minValue: MIN_VALUE,
        maxSize: MAX_MX_SIZE,
        minSize: MIN_MX_SIZE,
        disabled: true
    });
mxObjC.appendToBeginOf(mxWrapperC);

// генерация случайных матриц (для тестирования)
//setRandomMatix();

// настроим смену цвета фона меню при редактировании ячеек
mxObjA.onFocusItem = mxObjB.onFocusItem = function () {
    menu.classList.add('menu-edit');
};
mxObjA.onBlurItem = mxObjB.onBlurItem = function () {
    menu.classList.remove('menu-edit');
};

// зададим действия для кнопки "Умножить матрицы"
var btnMultMx = document.getElementById("btn-mult-mx");
btnMultMx.addEventListener("click", function (e) {
    if (!checkSizes() || !checkMatrix()){
        return;
    }
    var a = mxObjA.array, // достанем массивы из объектов
        b = mxObjB.array;

    mxObjC.array = mulMatrix(a, b); // перемножим их и присвоим объекту матрицы С
});

// зададим действия для кнопки "Очистить матрицы"
var btnClearMx = document.getElementById("btn-clear-mx");
btnClearMx.addEventListener("click", function (e) {
    // просто вызовем методы для очистки ячеек
    mxObjA.clearItems();
    mxObjB.clearItems();
    mxObjC.clearItems();
});

// зададим действия для кнопки "Поменять матрицы местами"
var btnExchangeMx = document.getElementById("btn-exchange-mx");
btnExchangeMx.addEventListener("click", function (e) {
    var temp = mxObjA.array;
    mxObjA.array = mxObjB.array;
    mxObjB.array = temp;

    mxObjC.fillWithEmptyCells(mxObjB.width, mxObjA.height);
    checkSizes();
});

// найдём переключатели матриц
var radioMxA = document.getElementById("radio-mx-A");
var radioMxB = document.getElementById("radio-mx-B");

// зададим действия для кнопки "Добавить строку"
var btnAddRowMx = document.getElementById("btn-add-row-mx");
btnAddRowMx.addEventListener("click", function (e) {
    if (radioMxA.checked){
        mxObjA.addRows();
        mxObjC.addRows();
    }
    else if (radioMxB.checked) {
        mxObjB.addRows();
    }
    checkSizes()
});

// зададим действия для кнопки "Добавить столбец"
var btnAddColMx = document.getElementById("btn-add-col-mx");
btnAddColMx.addEventListener("click", function (e) {
    if (radioMxA.checked){
        mxObjA.addColumns();
    }
    else if (radioMxB.checked) {
        mxObjB.addColumns();
        mxObjC.addColumns();
    }
    checkSizes()
});

// зададим действия для кнопки "Удалить строку"
var btnDelRowMx = document.getElementById("btn-del-row-mx");
btnDelRowMx.addEventListener("click", function (e) {
    if (radioMxA.checked){
        mxObjA.delRows();
        mxObjC.delRows();
    }
    else if (radioMxB.checked) {
        mxObjB.delRows();
    }
    checkSizes()
});

// зададим действия для кнопки "Удалить столбец"
var btnDelColMx = document.getElementById("btn-del-col-mx");
btnDelColMx.addEventListener("click", function (e) {
    if (radioMxA.checked){
        mxObjA.delColumns();
    }
    else if (radioMxB.checked) {
        mxObjB.delColumns();
        mxObjC.delColumns();
    }
    checkSizes()
});

// функция для проверки размеров матриц (ширина А должна быть равна выстое В)
// и вывода сообщения об этом
function checkSizes() {
    if (mxObjA.width != mxObjB.height){
        menu.classList.add('menu-error');
        messageBox.innerHTML = MESSAGES.WRONG_SIZES;
        return false;
    } else {
        menu.classList.remove('menu-error');
        messageBox.innerHTML = "";
        return true;
    }
}
// функция для проверки значеий в ячейках матриц (все ячейки заполнены, везде числа)
// и вывода сообщения об этом
function checkMatrix() {
    var message = '';
    if (!isMatrix(mxObjA.array)){
        message += mxObjA.name.toUpperCase() + ': ' + MESSAGES.WRONG_MATRIX;
    }
    if (!isMatrix(mxObjB.array)){
        message += '<br>'+ mxObjB.name.toUpperCase() + ': ' + MESSAGES.WRONG_MATRIX;
    }
    if (message){
        menu.classList.add('menu-error');
        messageBox.innerHTML = message;
        return false;
    }
    else{
        menu.classList.remove('menu-error');
        messageBox.innerHTML = "";
        return true;
    }
}

function setRandomMatix() {
    var Am = rnd(MIN_MX_SIZE, MAX_MX_SIZE), Bm,
        An = Bm = rnd(MIN_MX_SIZE, MAX_MX_SIZE),
        Bn = rnd(MAX_MX_SIZE, MAX_MX_SIZE),
        a = [], b = [],
        i, j;

    for (i = 0; i < Am; i++){
        a[i] = [];
        for (j = 0;  j < An; j++){
            a[i][j] = rnd(MIN_VALUE, MAX_VALUE);
        }
    }

    for (i = 0; i < Bm; i++){
        b[i] = [];
        for (j = 0;  j < Bn; j++){
            b[i][j] = rnd(MIN_VALUE, MAX_VALUE);
        }
    }

    mxObjA.array = a;
    mxObjB.array = b;
    mxObjC.fillWithEmptyCells(Bn, Am);


    function rnd(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

// проверка матрицы
function isMatrix(matrix){
    if (!(matrix instanceof Array))
        return false;

    // количество строк в матрице
    var m = matrix.length, n;

    // матрица может быть пустой
    if (m == 0)
        return true;

    for (var i = 0; i < m; i++){
        // матрица должна стостоять из массивов (строк)
        if (!(matrix[i] instanceof Array))
            return false;

        // определим ширину матрицы по количеству элементов в первой строке
        if (i == 0)
            n = matrix[0].length;

        // проверяем чтобы ширина каждой строки была одинаковой
        if (matrix[i].length !== n)
            return false;

        // элементы матрицы должны быть числами
        for (var j = 0; j < n; j++){
            if (!isFinite(matrix[i][j]) || matrix[i][j] === null || matrix[i][j]==='')
                return false;
        }
    }
    return true;
}
// сама функция умножения матриц
function mulMatrix(A, B) {
    var Am = A.length,
        An = A[0].length,
        Bm = B.length,
        Bn = B[0].length,
        C = [], // новый массив - результат умножения матриц A и B
        Cm = Am,
        Cn = Bn;

    // проверка типов, функция принимает только массивы
    if (!(A instanceof Array) && !(B instanceof Array)) {
        throw new Error("Wrong arguments type.");
    }

    // проверка размерности матриц (число столбцов в первой матрице должно быть равну числу строк во второй
    if (An !== Bm) {
        throw new Error("Wrong arguments size");
    }

    // перемножаем матрицы
    for (var i = 0; i < Cm; i++) {
        C[i] = [];
        for (var j = 0; j < Cn; j++) {
            C[i][j] = 0;
            for (var k = 0; k < An; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return C;
}