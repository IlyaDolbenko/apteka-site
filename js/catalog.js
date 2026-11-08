// 1. Массив данных (База данных товаров)
const products = [
    { id: 1, name: "Витамин C, 500 мг №100", category: "Витамины", brand: "Эвалар", discount: "Нет", price: "320", img: "images/vitamin-c.jpg" },
    { id: 2, name: "Аспирин Кардио, 100 мг №30", category: "Лекарства", brand: "Байер", discount: "Да", price: "250", img: "images/aspirin.jpg" },
    { id: 3, name: "Парацетамол, 500 мг №20", category: "Лекарства", brand: "Акрихин", discount: "Нет", price: "80", img: "images/medicine.jpg" },
    { id: 4, name: "Тонометр Omron M2", category: "Медтехника", brand: "Omron", discount: "Да", price: "2890", img: "images/tonometer.jpg" },
    { id: 5, name: "Глюкометр Accu-Chek", category: "Медтехника", brand: "Roche", discount: "Нет", price: "1750", img: "images/medtech.jpg" },
    { id: 6, name: "Компливит, №60", category: "Витамины", brand: "Фармстандарт", discount: "Да", price: "410", img: "images/vitamins.jpg" }
];

// 2. Список наших фильтров (Свойство: Заголовок)
const properties = {
    'category': 'Категория',
    'brand': 'Бренд',
    'discount': 'Скидка'
};

// --- ФУНКЦИИ ОТРИСОВКИ ---

function printProducts(arProducts, selector) {
    let output = '';
    if (arProducts.length === 0) {
        output = '<p class="no-results">По вашему запросу ничего не найдено.</p>';
    } else {
        for (let item of arProducts) {
            output += `
                <article class="product">
                    <img src="${item.img}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p><strong>Категория:</strong> ${item.category}</p>
                    <p><strong>Бренд:</strong> ${item.brand}</p>
                    <p><strong>Скидка:</strong> ${item.discount}</p>
                    <p><strong>Цена:</strong> ${item.price} руб.</p>
                </article>
            `;
        }
    }
    $(selector).html(output);
}

function printFilters(arProducts, arProperties, selector) {
    let output = '';
    for (let prop in arProperties) {
        output += `<div class="filter-group"><h3>${arProperties[prop]}</h3>`;
        let vals = [];
        for (let product of arProducts) {
            if (!vals.includes(product[prop])) { vals.push(product[prop]); }
        }
        vals.sort();
        vals.forEach(function(item) {
            output += `
                <label class="filter-label">
                    <input type="checkbox" name="${prop}" value="${item}">
                    ${item}
                </label><br>
            `;
        });
        output += `</div>`;
    }
    $(selector).html(output);
}

// --- ЛОГИКА ФИЛЬТРАЦИИ ---

function readCurFilters(selector, properties) {
    let result = {};
    for (let prop in properties) {
        let searchIDs = $(`#filters input[name="${prop}"]:checked`).map(function() {
            return $(this).val();
        }).get();
        result[prop] = searchIDs;
    }
    return result;
}

function applyFilters(data, filter, properties) {
    let result = [];
    for (let item of data) {
        let ok = true;
        for (let prop in properties) {
            if (!filter[prop].length) continue;
            if (filter[prop].indexOf(item[prop]) == -1) { ok = false; }
        }
        if (ok) result.push(item);
    }
    return result;
}

// --- УМНЫЙ ФИЛЬТР (Блокировка пустых вариантов) ---
function updateSmartFilters() {
    let currentFilters = readCurFilters('#filters', properties);

    for (let currentProp in properties) {
        // Временно убираем фильтр текущей группы
        let tempFilters = JSON.parse(JSON.stringify(currentFilters));
        tempFilters[currentProp] = [];

        // Смотрим, какие товары остались бы
        let tempData = applyFilters(products, tempFilters, properties);
        let availableValues = [];
        for (let item of tempData) {
            if (!availableValues.includes(item[currentProp])) { availableValues.push(item[currentProp]); }
        }

        // Блокируем чекбоксы, которых нет в доступных значениях
        $(`#filters input[name="${currentProp}"]`).each(function() {
            let val = $(this).val();
            if (!availableValues.includes(val)) {
                $(this).prop('disabled', true);
                $(this).parent().addClass('disabled-label');
            } else {
                $(this).prop('disabled', false);
                $(this).parent().removeClass('disabled-label');
            }
        });
    }
}

// --- ЗАПУСК ---
$(document).ready(function() {
    printProducts(products, '#elements');
    printFilters(products, properties, '#filters');

    // Обработка кликов по фильтрам
    $('#filters input[type="checkbox"]').on('change', function() {
        let curFilter = readCurFilters('#filters', properties);
        let filteredProducts = applyFilters(products, curFilter, properties);
        printProducts(filteredProducts, '#elements');
        updateSmartFilters(); // Вызываем умный фильтр
    });

    // Кнопка "Версия для печати"
    $('#btn-print-mode').on('click', function() {
        let printStyle = $('#print-style');
        if (printStyle.prop('disabled')) {
            printStyle.prop('disabled', false);
            $(this).text('Обычная версия');
        } else {
            printStyle.prop('disabled', true);
            $(this).text('Версия для печати');
        }
    });
});