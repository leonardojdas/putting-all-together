//const { MenuItem } = require('../entity/MenuItem');
const METHODS = {
    GET: 'get',
    POST: 'add',
    PUT: 'update',
    DELETE: 'delete'
}
let method = METHODS.GET;
const URL_PATH = 'http://localhost:8000/api/menuItems/';

window.onload = function (){
    document.querySelector('#items').addEventListener('click', handleItemClick);
    document.querySelector('#addButton').addEventListener('click', e => loadPanel(METHODS.POST));
    document.querySelector('#updateButton').addEventListener('click', e => loadPanel(METHODS.PUT));
    document.querySelector("#deleteButton").addEventListener('click', e => loadPanel(METHODS.DELETE));

    // fields validation
    document.querySelector('#itemId').addEventListener('change', showSubmit);
    document.querySelector('#itemCategory').addEventListener('change', showSubmit);
    document.querySelector('#itemDescription').addEventListener('change', showSubmit);
    document.querySelector('#itemPrice').addEventListener('change', showSubmit);
    document.querySelector('#itemVegetarian').addEventListener('change', showSubmit);

    // submit request
    document.querySelector('#submitButton').addEventListener('click', submitRequest);

    doGet();
}

function doGet() {
    let url = URL_PATH;
    let method = "GET";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let res = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                buildTable(res.data);
            } else {
                alert(`Error: ${res.err}`);
            }
        }
    };
    xhr.open(method, url, true);
    xhr.send();
}

function doAdd(item){
    let id = Number(document.querySelector('#itemId').value);
    let url = URL_PATH + id;
    let method = "POST";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let res = JSON.parse(xhr.responseText);
            if (xhr.status === 201){
                if(res.data) {
                    alert('Add successful');
                } else {
                    alert(`Error: ${res.err}`);
                }
                submitReturn();
            } else {
                alert(`Error: ${res.err}`)
            }
        }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(item));
}

function doUpdate(item){
    let row = document.querySelector('.selected');
    if(row !== null){
        let id = Number(document.querySelector('#itemId').value);
        let url = URL_PATH + id;
        let method = "PUT";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res = JSON.parse(xhr.responseText);
                if (xhr.status === 200){
                    if(res.data) {
                        alert('Update successful');
                    } else {
                        alert(`Error: ${res.err}`);
                    }
                    submitReturn();
                } else {
                    alert(`Error: ${res.err}`)
                }
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(item));
    }
}

function doDelete(){
    let row = document.querySelector('.selected');
    if(row !== null){
        let id = Number(row.querySelectorAll('td')[0].innerHTML);

        let url = URL_PATH + id;
        let method = "DELETE";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res = JSON.parse(xhr.responseText);
                if (xhr.status === 200){
                    if(res.data) {
                        alert('Delete successful');
                    } else {
                        alert(`Error: ${res.err}`);
                    }
                    submitReturn();
                } else {
                    alert(`Error: ${res.err}`)
                }
            }
        };
        xhr.open(method, url, true);
        xhr.send();
    }
}

function loadPanel(button){
    if(button === METHODS.POST){
        method = METHODS.POST;
    } else if(button === METHODS.PUT){
        method = METHODS.PUT;
    } else {
        method = METHODS.DELETE;
    }
    showPanel();
    populateInputPanel();
    showSubmit();
}

function buildTable(data) {
    let table = document.querySelector("#items");

    let html = '<table class="table table-striped">';
    html += '<thead class="table-dark">';
    html += '<tr>';
    html += '<th class="col-1">ID</th>';
    html += '<th class="col-1">Category</th>';
    html += '<th class="col-8">Description</th>';
    html += '<th class="col-1">Price</th>';
    html += '<th class="col-1">Vegetarian</th>';
    html += '</tr>';
    html += '</thead>';

    html += '<tbody>';

    data.forEach((item) => {
        html += `<tr class="tr-item">`;
        html += `<td>${item.id}</td>`;
        html += `<td>${item.category}</td>`;
        html += `<td>${item.description}</td>`;
        html += `<td>${item.price}</td>`;
        html += `<td>${item.vegetarian}</td>`;
        html += `</tr>`;
    });
    
    html += '</tbody>';
    html += "</table>";

    table.innerHTML = html;
}

function handleItemClick(ev){
    let e = ev.target;
    if(e.nodeName !== 'TD') return;
    clearSelections();
    let row = e.parentElement;
    row.classList.add('selected');
    document.querySelector('#updateButton').disabled = false;
    document.querySelector('#deleteButton').disabled = false;
    populateInputPanel();
    showSubmit();
}

function clearSelections(){
    let rows = document.querySelectorAll('tr');
    for(let i = 0; i < rows.length; i++){
        rows[i].classList.remove('selected');
    };
}

function populateInputPanel(){
    // clean panel
    document.querySelector('#itemId').value = '';
    document.querySelector('#itemCategory').value = '';
    document.querySelector('#itemDescription').value = '';
    document.querySelector('#itemPrice').value = '';
    document.querySelector('#itemVegetarian').checked = false;

    // enable fields
    document.querySelector('#itemId').disabled = false;
    document.querySelector('#itemCategory').disabled = false;
    document.querySelector('#itemDescription').disabled = false;
    document.querySelector('#itemPrice').disabled = false;
    document.querySelector('#itemVegetarian').disabled = false;


    if(method !== METHODS.POST){
        // get selected item
        let row = document.querySelector('.selected');

        // get values
        let id = Number(row.querySelectorAll('td')[0].innerHTML);
        let category = row.querySelectorAll('td')[1].innerHTML;
        let description = row.querySelectorAll('td')[2].innerHTML;
        let price = Number(row.querySelectorAll('td')[3].innerHTML);
        let vegetarian = row.querySelectorAll('td')[4].innerHTML;

        // populate panel
        document.querySelector('#itemId').value = id;
        document.querySelector('#category'+category).selected = true;    
        document.querySelector('#itemDescription').value = description;
        document.querySelector('#itemPrice').value = price;

        if(vegetarian === 'true') document.querySelector('#itemVegetarian').checked = true;

        // disable id field - PUT and DELETE
        document.querySelector('#itemId').disabled = true;

        if(method === METHODS.DELETE){
            document.querySelector('#itemCategory').disabled = true;
            document.querySelector('#itemDescription').disabled = true;
            document.querySelector('#itemPrice').disabled = true;
            document.querySelector('#itemVegetarian').disabled = true;
        };
    };

    // inform the method
    document.querySelector('#methodTitle').innerHTML = method.toUpperCase();
}

function showPanel(){
    document.querySelector('#methodsPanel').classList.remove('hidden');
}

function showSubmit(){
    let submit = document.querySelector('#submitButton');
    
    if(
    document.querySelector('#itemId').value !== '' &&
    document.querySelector('#itemCategory').value !== '' &&
    document.querySelector('#itemDescription').value !== '' &&
    document.querySelector('#itemPrice').value !== ''
    )
    {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
}

function submitRequest(){
    let id = Number(document.querySelector('#itemId').value);
    let category = document.querySelector('#itemCategory').value;
    let description = document.querySelector('#itemDescription').value === '' ? null : document.querySelector('#itemDescription').value;
    let price = Number(document.querySelector('#itemPrice').value);
    let vegetarian = (document.querySelector('#itemVegetarian').checked ? true : false);

    let err = checkArgs(id, category, description, price, vegetarian);

    if(err !== null){
        alert(`Error: ${err}`);
    } else {
        let item = {
            id: id,
            category: category,
            description: description,
            price: price,
            vegetarian: vegetarian
        };

        if(method === METHODS.POST){
            doAdd(item);
        } else if (method === METHODS.PUT){
            doUpdate(item);
        } else {
            doDelete();
        };
    }
}

// Brought this function to the front because app.js can't take the error 
// message sent by the class, to not breaking the validation of the
// mocha "Expected Failures II - bad data sent" tests
function checkArgs(id, category, description, price, vegetarian) {
    let err = null;

    if (id === null || id === undefined) {
        err = "id must be defined";
    } else if (typeof id !== "number") {
        err = "id must be a number";
    } else if (id < 100 || id > 999) {
        err = "id must be in range [100,999]";
    } else if (category === null || category === undefined) {
        err = "category must be defined";
    } else if (typeof category !== "string") {
        err = "category must be a string";
    } else if (category.length !== 3) {
        err = "category must be three letters";
    } else if (description === null || description === undefined) {
        err = "description must be defined";
    } else if (typeof description !== "string") {
        err = "description must be a string";
    } else if (price === null || price === undefined) {
        err = "price must be defined";
    } else if (typeof price !== "number") {
        err = "price must be a number";
    } else if (price < 0) {
        err = "price must be greater than 0";
    } else if (vegetarian === null || vegetarian === undefined) {
        err = "vegetarian must be defined";
    } else if (typeof vegetarian !== "boolean") {
        err = "vegetarian must be a boolean";
    }
    
    return err;
}

function submitReturn(){
    doGet();
    clearSelections();
    document.querySelector('#methodsPanel').classList.add('hidden');
}