const employees = [
  {
    id: 0,
    name: "YarikHead",
    dept_unit_id: 0,
    tel: "123-123-3",
    salary: 3000,
  },
  {
    id: 1,
    name: "MashaLead",
    dept_unit_id: 1,
    tel: "123-123-3",
    salary: 2000,
  },
  {
    id: 2,
    name: "SashaLead",
    dept_unit_id: 1,
    tel: "123-123-3",
    salary: 2200,
  },
  {
    id: 3,
    name: "MirraDev",
    dept_unit_id: 2,
    tel: "123-123-3",
    salary: 1200,
  },
  {
    id: 4,
    name: "IraDev",
    dept_unit_id: 2,
    tel: "123-123-3",
    salary: 1000,
  },
  {
    id: 5,
    name: "DanikHead3",
    dept_unit_id: 3,
    tel: "123-123-33",
    salary: 3000,
  },
  {
    id: 6,
    name: "OliaLead3",
    dept_unit_id: 4,
    tel: "123-123-3",
    salary: 2200,
  },
  {
    id: 7,
    name: "KoliaLead",
    dept_unit_id: 4,
    tel: "123-123-3",
    salary: 2000,
  },
  {
    id: 8,
    name: "LenaTest",
    dept_unit_id: 5,
    tel: "123-123-3",
    salary: 1200,
  },
  {
    id: 9,
    name: "SienaTest",
    dept_unit_id: 5,
    tel: "123-123-3",
    salary: 1000,
  },
];

const departments = [
  {
    name: "Development Management",
    id: 0,
    dept_units: null,
  },
  {
    name: "Lead Developers",
    id: 1,
    dept_units: 0,
  },
  {
    name: "Developers",
    id: 2,
    dept_units: 1,
  },
  {
    name: "Quality Assurance Management",
    id: 3,
    dept_units: null,
  },
  {
    name: "Lead QA",
    id: 4,
    dept_units: 3,
  },
  {
    name: "Testers",
    id: 5,
    dept_units: 4,
  },
];
//================================================
function getTree(array) {
  array.forEach((potentialChild) => {
    array.forEach((potentialParent) => {
      if (potentialParent.id === potentialChild.dept_units) {
        if (!potentialParent.children) {
          potentialParent.children = [];
        }
        potentialParent.children.push(potentialChild);
      }
    });
  });
  return array.filter((item) => item.dept_units === null);
}
const tree = getTree(departments);
console.log("tree", tree);
//===============================================
const recursionTreeElement = document.getElementById("recursionTreeElement");
buildDOMTree(tree, recursionTreeElement);

function buildDOMTree(items, supportEl) {
  const ulElement = document.createElement("ul");
  recursion(items, ulElement);
  supportEl.appendChild(ulElement);
}

function recursion(items, rootElement) {
  items.forEach((item) => {
    const liElement = document.createElement("li");
    liElement.setAttribute("data-dept-id", item.id);
    liElement.innerHTML = item.children
      ? `<i class="fa fa-chevron-right"></i>${item.name}`
      : `${item.name}`;
    rootElement.appendChild(liElement);

    if (item.children) {
      const childrenUl = document.createElement("ul");
      childrenUl.classList.add("hidden");
      liElement.appendChild(childrenUl);
      recursion(item.children, childrenUl);
    }
  });
}
//=====================================================
document.addEventListener("click", function (ev) {
  if (ev.target.nodeName === "I") {
    const childLi = ev.srcElement.nextElementSibling;
    childLi.classList.toggle("hidden");
    childLi.classList.toggle("visible");
    ev.target.classList.toggle("fa-chevron-right");
    ev.target.classList.toggle("fa-chevron-down");
  }
});
//=====================================================
const container = document.getElementById("container");
const table = document.createElement("table");
const thead = document.createElement("thead");
const trHead = document.createElement("tr");
const tbody = document.createElement("tbody");

for (key in employees[0]) {
  const th = document.createElement("th");
  th.innerText = key;
  trHead.append(th);
}
thead.append(trHead);
table.append(thead);
container.append(table);
//==================================================
const clearTableBtn = document.getElementById("clearTable");
clearTableBtn.addEventListener("click", clear);

function clearTable() {
  for (let i = 1; i < table.rows.length; ) {
    table.deleteRow(i);
  }
}
function deleteBold() {
  let liArray = document.getElementsByTagName("li");
  Array.prototype.forEach.call(liArray, (liOne) => {
    liOne.classList.remove("bold");
  });
}
function clear() {
  clearTable();
  deleteBold();
}
//===================================================
document.addEventListener("click", function (ev) {
  if (ev.target.nodeName === "LI") {
    clear();
    ev.target.classList.add("bold");
    //=================================================
    const idClickDepartment = +ev.target.getAttribute("data-dept-id");
    const filteredEmployees = employees.filter(function (employee) {
      return employee.dept_unit_id === idClickDepartment;
    });
    //=================================================
    filteredEmployees.forEach((employee) => {
      const tr = document.createElement("tr");
      for (key in employee) {
        const td = document.createElement("td");
        if (key === "salary") {
          td.setAttribute("data-salary", employee.salary);
        }
        td.innerText = employee[key];
        tr.append(td);
      }
      tbody.append(tr);
    });
    table.append(tbody);
    container.append(table);
  }
  if (curr_sel.value != 0) {
    changeCurrencySalary();
  }
});
//======================================
const currIds = [145, 292, 298];
const curr_sel = document.getElementById("curr_sel");

init();
async function init() {
  await Promise.all(currIds.map((id) => getCurrencies(id)));
  getLocalStorage();
}

async function getCurrencies(id) {
  const rates = await fetch(`https://www.nbrb.by/api/exrates/rates/${id}`);
  const fetchedRates = await rates.json();
  const jsStrRate = JSON.stringify(fetchedRates);
  localStorage.setItem(fetchedRates.Cur_ID, jsStrRate);
}

function getLocalStorage() {
  currIds.forEach((id) => {
    const optionEl = document.createElement("option");
    const elementJSON = JSON.parse(localStorage.getItem(id));
    optionEl.innerText = elementJSON.Cur_Abbreviation;
    optionEl.value = elementJSON.Cur_ID;
    curr_sel.append(optionEl);
  });
}

curr_sel.addEventListener("change", () => {
  changeCurrencySalary();
});

function changeCurrencySalary() {
  const tableSalaryItems = document.querySelectorAll("td[data-salary]");

  for (let i = 0; i < localStorage.length; i++) {
    let keyNumber = localStorage.key(i);
    if (keyNumber === curr_sel.value) {
      const elementJSON = JSON.parse(localStorage.getItem(keyNumber));
      const currRate = elementJSON.Cur_OfficialRate;
      const currScale = elementJSON.Cur_Scale;

      for (let i = 0; i < tableSalaryItems.length; i++) {
        const originalSalaryCount = +tableSalaryItems[i].getAttribute(
          "data-salary"
        );
        tableSalaryItems[i].innerText = (
          (originalSalaryCount * currScale) /
          currRate
        ).toFixed(2);
      }
    }
  }
}
