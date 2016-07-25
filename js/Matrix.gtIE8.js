'use strict';
// В ЭТОМ СКРИПТЕ ПРОБЛЕМЫ С СОВМЕСТИМОСТЮ С IE8-

// Объект предоставлющий методы для создания и работы с DOM блоком матрицы
function MatrixObject(options) {
    // пармаетры по умолчанию
    this._width = 0; // количество столбцов
    this._height = 0; // количество строк
    this.name = ''; // имя матрицы
    this.maxValue = 999; // максимальное значение поля
    this.minValue = -999; // минимальное значение поля
    this.maxSize = 10; // максимальный порядок матрицы
    this.minSize = 1; // минимальный порядок матрицы
    this.numeric = false; // только числа

    //Контейнер матрицы
    this.element = document.createElement('div');
    this.element.className = 'matrix';

    //Шаблон контейнера строки
    this.rowTmpl = document.createElement('div');
    this.rowTmpl.className = 'row';

    //Шаблон ячейки матрицы
    this.itemTmpl = document.createElement('input');
    this.itemTmpl.type = 'text';
    this.itemTmpl.className = 'input-text';

    // применим переданные параметры
    this.options = options;

}
MatrixObject.prototype = {
    constructor: MatrixObject,
    set options(options) {
        this._width = options.width || this._width; // количество столбцов
        this.name = options.name || this.name; // имя матрицы
        this.itemTmpl.disabled = options.disabled || this.rowTmpl.disabled; // блокировка полей
        this.maxValue = options.maxValue || this.maxValue; // максимальное значение поля
        this.minValue = options.minValue || this.minValue; // минимальное значение поля
        this.maxSize = options.maxSize || this.maxSize; // максимальный порядок матрицы
        this.minSize = options.minSize || this.minSize; // минимальный порядок матрицы
        this.numeric = options.numeric || this.numeric; // только числа

        //Заполнить матрицу
        this.addRows(options.height || this._height); // количество строк
    },
    // получить массив из матрицы
    get array() {
        var array = [];
        for (var i = 0; i < this._height; i++){
            array[i] = [];
            for (var j = 0; j < this._width; j++){
                array[i][j] = this.element.childNodes[i].childNodes[j].value;
            }
        }
        return array;
    },
    // задать матрицу из массива
    set array(value) {
        this.clear();
        this._width = value[0].length;
        this.addRows(value.length, value);
    },
    get width(){
        return this._width;
    },
    get height(){
        return this._height;
    },
    // добавление строк в матрицу
    addRows: function (m, arr) {
        //количество строк, которое будет добавлено
        m = m || 1; // по умолчанию одна

        // добавляем m строк либо до максимума
        for (var i = 0; (i < m) && (this._height < this.maxSize); i++){
            // скопируем новую строку из шаблона
            var newRow = this.rowTmpl.cloneNode(true);
            // заполним её элементами
            for (var j = 0; j < this._width; j++){
                // скопируем новую ячейку из шаблона
                var newItem = this.itemTmpl.cloneNode(true);
                // заполним placeholder
                newItem.placeholder = this.name + (this._height + 1) + "," + (j+1);
                // добавим общие события каждой ячейки
                var self = this;
                newItem.addEventListener('focus', function(e){
                    self.onFocusItem(e, this);
                });
                newItem.addEventListener('blur', function (e) {
                    self.onBlurItem(e, this);
                });
                newItem.addEventListener('change', function (e) {
                    self.validateItem(this);
                    self.onChangeItem(e, this);
                });
                // возьмем новое значение из данного массива
                if (arr && arr.length > i && arr[0].length > j)
                    newItem.value = arr[i][j];
                // добавим ячейку к строке
                newRow.appendChild(newItem);
            }
            // добавим строку к матрице
            this.element.appendChild(newRow);
            this._height++;
        }
    },
    // добавление столбцов в матрицу
    addColumns: function (n, arr) {
        //количество столбцов, которое будет добавлено
        n = n || 1; // по умолчанию один

        // добавляем n столбцов либо до максимума
        for (var j = 0; (j < n) && (this._width < this.maxSize); j++){
            for (var i = 0; i < this.element.childNodes.length; i++){
                // скопируем новую ячейку из шаблона
                var newItem = this.itemTmpl.cloneNode(true);
                // заполним placeholder
                newItem.placeholder = this.name + (i + 1) + "," + (this._width + 1);
                // добавим общие события каждой ячейки
                var self = this;
                newItem.addEventListener('focus', function(e){
                    self.onFocusItem(e, this);
                });
                newItem.addEventListener('blur', function (e) {
                    self.onBlurItem(e, this);
                });
                newItem.addEventListener('change', function (e) {
                    self.validateItem(this);
                    self.onChangeItem(e, this);
                });
                // возьмем новое значение из данного массива
                if (arr && arr.length > i && arr[0].length > j)
                    newItem.value = arr[i][j];
                // добавим ячейку к строке
                this.element.childNodes[i].appendChild(newItem);
            }
            this._width++;
        }

    },
    // удаление строк
    delRows: function(m){
        m = m || 1; // по умолчанию одну строку
        // удаляем m строк либо до минимума
        for (var i = 0; (i < m) && (this._height > this.minSize); i++){
            // удаляем последнюю строку
            this.element.removeChild(this.element.lastChild);
            this._height--;
        }
    },
    // удаление столбцов
    delColumns: function (n) {
        n = n || 1; // по умолчанию один столбец
        // удаляем n столбцов либо до минимума
        for (var j = 0; (j < n) && (this._width > this.minSize); j++){
            for (var i = 0; i < this.element.childNodes.length; i++) {
                // удаляем последний элемент в каждой строке
                this.element.childNodes[i].removeChild(this.element.childNodes[i].lastChild);
            }
            this._width--;
        }
    },
    // заполнить матрицу пустыми ячейками с заданным размером
    fillWithEmptyCells: function (width, height) {
        this.clear();
        this._width = width;
        this.addRows(height);
    },
    // очистить матрицу
    clear: function () {
        this.element.innerHTML = "";
        this._width = 0;
        this._height = 0;
    },
    // очистить все ячейки матрицы
    clearItems: function () {
        for (var i = 0; i < this._height; i++){
            for (var j = 0; j < this._width; j++){
                this.element.childNodes[i].childNodes[j].value = '';
            }
        }
    },
    // добавление матрицы в начало элемента
    appendToBeginOf: function (element) {
        element.insertBefore(this.element, element.firstChild);
    },

    // проверка и исправление значений ячейки
    validateItem: function (item) {
        if (this.numeric){
            // на всякий случай преобразуем в число
            item.value = +item.value;
            // если введено не число, очистим ячейку
            if (!isFinite(item.value))
                item.value = '';
            // если число больше максимального, изменим на максимальное
            if (item.value > MAX_VALUE)
                item.value = MAX_VALUE;
            // если число меньше минимального, изменим на максимальное
            if (item.value < MIN_VALUE)
                item.value = MIN_VALUE;
        }
    },

    // заглушки для событий
    onFocusItem: function (e) {
    },
    onBlurItem: function (e) {
    },
    onChangeItem: function (e) {
    }  

};