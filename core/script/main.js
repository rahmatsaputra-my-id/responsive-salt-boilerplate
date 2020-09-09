const test = document.getElementById("Test");
const test2 = document.getElementById("Test2");
let letName = "Ini pake Let"

test.innerHTML = "Ini jalan dari script pake const";


const newName = (name) => {
  return name
}

test2.innerHTML = newName(letName)