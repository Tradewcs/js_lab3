import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


const appSettings = {
    databaseURL: "https://jslab3-6c069-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const recordsInDB = ref(database, "records");


const passwordList = document.getElementById("passwordList");

let ID_Records = {};

const dialog = document.getElementById("dialog");

let records = [
    {username: "user1", password: "admin123"},
];

onValue(recordsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let passwordsFromDB = Object.values(snapshot.val());
        // console.log(passwordsFromDB);
        records = passwordsFromDB;
        
        ID_Records = Object.entries(snapshot.val());
    
        displayPasswords();
    }
})

function findID(record) {
    for (let i = 0; i < ID_Records.length; i++) {
        if (ID_Records[i][1].username == record.username && ID_Records[i][1].password == record.password) {
            return ID_Records[i][0];
        }
    }
}


function multiplyChar(char, count) {
    let res = '';
    for (let i = 0; i < count; i++) {
        res += char;
    }

    return res;
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function createElement(elName, classList, innerHTML, id) {
    const el = document.createElement(elName);
    
    if (classList) {
        classList.forEach(className => {
            el.classList.add(className);
        });
    }
    if (id) el.id = id;
    if (innerHTML) el.innerHTML = innerHTML;

    return el;
}


function displayPasswords() {    
    passwordList.innerHTML = "";
    records.forEach((record, index) => {
        const passwordRow = createElement(
            "tr",
            ["password-tr"],
            "<td> <b>" + record.username + " | " + multiplyChar("*", record.password.length) + "</b> </td>",
        );
        
        const i_copy_icon = createElement(
            "i",
            ["fa", "fa-clipboard"]
        );

        const i_show_icon = createElement(
            "i",
            ["fa", "fa-eye"]
        )

        const copyButton = createElement(
            "button",
            ["copy-button"]
        );
        copyButton.appendChild(i_copy_icon);
        copyButton.addEventListener("click", () => {
            copyToClipboard(record.password);
            copyButton.style.color = "black";
            setTimeout(() => {
                copyButton.style.color = "white";
                copyButton.appendChild(i_copy_icon);
            }, 1000);
        });

        const showButton = createElement(
            "button",
            ["show-button"]
        );
        showButton.appendChild(i_show_icon);
        showButton.addEventListener("click", () => {
            const pass_div = showButton.parentNode.parentNode;
            pass_div.querySelector("b").innerHTML = record.username + " | " + record.password;
            showButton.style.color = "black";
            setTimeout(() => {
                showButton.style.color = "white";
                pass_div.querySelector("b").innerHTML = record.username + " | " + multiplyChar("*", record.password.length);
            }, 1000)
            console.log(pass_div);
        })

        const deleteButton = createElement(
            "button",
            ["delete-button"],
            "Delete",
        );
        deleteButton.addEventListener("click", () => {
            records.splice(index, 1);

            remove(ref(database, `records/${findID(record)}`));

            displayPasswords();
        });

        const td = createElement(
            "td",
            ["buttons-col"]
        )

        td.appendChild(copyButton);
        td.appendChild(showButton);
        td.appendChild(deleteButton);
        passwordRow.appendChild(td)
        passwordList.appendChild(passwordRow);
    });
}

document.getElementById("addPasswordButton").addEventListener("click", () => {
    dialog.style.display = "block";
    
});

let username_input = document.getElementById("username");
let password_input = document.getElementById("password");

document.getElementById("addButton").addEventListener("click", () => {
    if (username_input.value != "" && password_input.value != "") {
        const record = {username: username_input.value, password: password_input.value};
        records.push(record);
        
        const res_push = push(recordsInDB, record);

        localStorage.setItem("records", JSON.stringify(records));

        username_input.value = "";
        password_input.value = "";
        
        dialog.style.display = "none";
        displayPasswords();
    }
})

document.getElementById("closeButton").addEventListener("click", () => {
    username_input.value = "";
    password_input.value = "";
    dialog.style.display = "none";
})

dialog.style.display = "none";
