import "./App.css";
import './gui.css';
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
const { MenuTitle } = require("./components/menuTitle");
const { MenuPanel } = require("./components/menuPanel");
const { MenuTable } = require("./components/menuTable");

class App extends React.Component {

    state = { 
        items: [],
        selectedItem: {
            id: "",
            category: "",
            description: "",
            price: "",
            vegetarian: ""
        },
        formItem: {
            id: "",
            category: "",
            description: "",
            price: "",
            vegetarian: ""
        },
        METHODS: {
            GET: 'GET',
            POST: 'ADD',
            PUT: 'UPDATE',
            DELETE: 'DELETE'
        },
        currentMethod: "",
        URL_PATH: 'http://localhost:8000/api/menuItems/',
        showMenu: false,

     };

    componentDidMount() {
        this.doGet();
    }

    render() {
        return (
            <React.Fragment>
                <MenuTitle />

                <MenuPanel
                    handleState={this.state}
                    handleMethods={this.handleMethods}
                    handleFormChange={this.handleFormChange}
                    handleConfirmAction={this.handleConfirmAction}
                />

                <MenuTable
                    handleState={this.state}
                    handleItemClicked={this.handleItemClicked}
                />
            </React.Fragment>
        );
    }

    // MenuPanel handlers
    handleMethods = (e) => {
        let button = (e.target.value).toUpperCase();

        if(button === this.state.METHODS.POST){
            this.state.currentMethod = this.state.METHODS.POST;
        } else if(button === this.state.METHODS.PUT){
            this.state.currentMethod = this.state.METHODS.PUT;
        } else {
            this.state.currentMethod = this.state.METHODS.DELETE;
        }
        
        this.setState({ showMenu: true });
    };

    handleFormChange = (e) => {
        let input = e.target.parentElement.parentElement;

        let id = Number(input.childNodes[1].childNodes[0].value);
        let category = input.childNodes[2].childNodes[0].value;
        let description = input.childNodes[3].childNodes[0].value;
        let price = (input.childNodes[4].childNodes[0].value === "" ? null : Number(input.childNodes[4].childNodes[0].value));
        let vegetarian = (input.childNodes[5].childNodes[0].value === "true" ? true : false);

        let item = {
            id: id,
            category: category,
            description: description,
            price: price,
            vegetarian: vegetarian
        }

        this.setState({ formItem: item });
    }

    handleConfirmAction = (e) => {
        let err = this.checkArgs();

        if(err !== null){
            alert(`Error: ${err}`);
        } else {
            if(this.state.currentMethod === this.state.METHODS.POST){
                this.doAdd();
            } else if (this.state.currentMethod === this.state.METHODS.PUT){
                this.doUpdate();
            } else {
                this.doDelete();
            }
        }
    }

    // MenuTable handlers
    handleItemClicked = (e) => {
        let row = e.target.parentElement;
        let id = Number(row.children[0].innerHTML);
        let category = row.children[1].innerHTML;
        let description = row.children[2].innerHTML;
        let price = Number(row.children[3].innerHTML);
        let vegetarian = (row.children[4].innerHTML === "Yes" ? true : false);

        let selectedItem = [];
        let newArray = this.state.items;
        newArray.map((i) => {
            if(Number(i.item.id) === id){
                i.selected = true;
                selectedItem = {
                    id: Number(i.item.id),
                    category: i.item.category,
                    description: i.item.description,
                    price: Number(i.item.price),
                    vegetarian: i.item.vegetarian
                }
            } else {
                i.selected = false;
            }
        });

        this.setState({ items: newArray });
        this.setState({ selectedItem: selectedItem });
        this.setState({ formItem: selectedItem });

        let d = document;
        d.querySelector("#itemId").value = id;
        d.querySelector("#itemCategory").value = category;
        d.querySelector("#itemDescription").value = description;
        d.querySelector("#itemPrice").value = price;
        d.querySelector("#itemVegetarian").value = vegetarian;
    }

    // auxiliary functions
    submitReturn(){
        this.doGet();
        this.setState({ showMenu: false });

        let d = document;
        d.querySelector("#itemId").value = "";
        d.querySelector("#itemCategory").value = "";
        d.querySelector("#itemDescription").value = "";
        d.querySelector("#itemPrice").value = "";
        d.querySelector("#itemVegetarian").value = "";
    }

    checkArgs() {
        let err = null;

        let id = Number(this.state.formItem.id);
        let category = this.state.formItem.category;
        let description = this.state.formItem.description;
        let price = this.state.formItem.price;
        let vegetarian = this.state.formItem.vegetarian;
    
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
        } else if (description === null || description === undefined || description === "") {
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

    // CRUD
    doGet(){
        this.state.currentMethod = this.state.METHODS.GET;
        let url = this.state.URL_PATH;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    //this.setState({ items: res.data });
                    let object = [];
                    res.data.forEach((e) => {
                        object.push({
                            item: e,
                            selected: false
                        });                        
                    });
                    this.setState({ items: object });

                } else {
                    alert(`Error: ${res.err}`);
                }
            }
        };
        xhr.open(this.state.currentMethod, url, true);
        xhr.send();
    }

    doAdd(){
        let id = this.state.formItem.id;
        this.state.currentMethod = this.state.METHODS.POST;

        let url = this.state.URL_PATH + id;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res = JSON.parse(xhr.responseText);
                if (xhr.status === 201){
                    if(res.data) {
                        alert('Add successful');
                    } else {
                        alert(`Error: ${res.err}`);
                    }
                    this.submitReturn();
                } else {
                    alert(`Error: ${res.err}`)
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(this.state.formItem));
    }

    doUpdate(){
        let id = this.state.formItem.id;
        this.state.currentMethod = this.state.METHODS.PUT;

        let url = this.state.URL_PATH + id;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res = JSON.parse(xhr.responseText);
                if (xhr.status === 200){
                    if(res.data) {
                        alert('Update successful');
                    } else {
                        alert(`Error: ${res.err}`);
                    }
                    this.submitReturn();
                } else {
                    alert(`Error: ${res.err}`)
                }
            }
        };
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(this.state.formItem));
    }

    doDelete(){
        let id = this.state.formItem.id;
        this.state.currentMethod = this.state.METHODS.DELETE;

        let url = this.state.URL_PATH + id;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res = JSON.parse(xhr.responseText);
                if (xhr.status === 200){
                    if(res.data) {
                        alert('Delete successful');
                    } else {
                        alert(`Error: ${res.err}`);
                    }
                    this.submitReturn();
                } else {
                    alert(`Error: ${res.err}`)
                }
            }
        };
        xhr.open("DELETE", url, true);
        xhr.send();
    }
}

export default App;