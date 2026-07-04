let point = parseInt(localStorage.getItem('savedPoints')) || 0; // Load saved points or start at 0
let imageURL = '';
let directNumber = 0;
let name = '';

const plusOne = document.getElementsByClassName("plus-one");
const plusTwo = document.getElementsByClassName("plus-two");
const plusThree = document.getElementsByClassName("plus-three");
const minusOne = document.getElementsByClassName("minus-one");

const totalPoint = document.getElementById("total-points");
const newGoal = document.getElementById("new-goal");
const hideGoal = document.getElementById("hide-goal")

const input = document.getElementById("imageinput");
const preview = document.getElementById("preview");
const newGoalContainer = document.getElementById("image-inp");

const setNewPoint = document.getElementById("set-point");
const doneButton = document.getElementById("done-btn");
const nameInput = document.getElementById("name")

// --- INITIAL LOAD ---
totalPoint.innerHTML = point;
// Load saved goals from storage
const savedGoalsHTML = localStorage.getItem('goalCards');
if (savedGoalsHTML) {
    document.getElementById("flex").innerHTML = savedGoalsHTML;
    reattachBuyButtons(); // We need to make the "buy" buttons work again after loading
}

newGoal.addEventListener('click', function() {
  newGoalContainer.style.display = 'block';
  newGoal.style.display = 'none'
  hideGoal.style.display = 'block'
})

hideGoal.addEventListener('click', function() {
  newGoalContainer.style.display = 'none';
  newGoal.style.display = 'block'
  hideGoal.style.display = 'none'
})

for (const button of plusOne) {
  button.onclick = () => addPoint(10);
}

for (const button of plusTwo) {
  button.onclick = () => addPoint(5);
}

for (const button of plusThree) {
  button.onclick = () => addPoint(2);
}

for (const button of minusOne) {
  button.onclick = () => addPoint(-30);
}

function addPoint(number) {
  point = point + number
  totalPoint.innerHTML = point
  localStorage.setItem('savedPoints', point); // Save point
}

input.addEventListener('change', function() {
  let file = this.files[0];
  if (file) {
    const reader = new FileReader(); 
    reader.onload = function(e) {
        imageURL = e.target.result; // Use Base64 so image saves forever
        preview.innerHTML = `<img src="${imageURL}" style="max-width: 100px;margin:10px">`;
    };
    reader.readAsDataURL(file);
  }
})

setNewPoint.addEventListener('change', function(){
  directNumber = setNewPoint.valueAsNumber;
})

nameInput.addEventListener('change', function() {
  name = nameInput.value;
})

doneButton.addEventListener('click', function() {
  createGoalCard(imageURL, directNumber, name, "x");
  saveAllGoals();
})

// Function to build the card (Shared by click and load)
function createGoalCard(img, price, goalName, buyStatus) {
  const newDiv = document.createElement('div');
  const newImage = document.createElement('img');
  const newBuyButton = document.createElement('button');
  const status = document.createElement('p');
  const nameFinal = document.createElement('p');
  const thingPrice = document.createElement('p');
  const divImg = document.createElement('div');
  const divDetail = document.createElement('div');
  const divDetailSub = document.createElement('div');
  const divDetailName = document.createElement('div');
  
  newImage.src = img;
  newImage.style.height = '100px'

  thingPrice.textContent = price;
  thingPrice.className = 'price-p'

  newDiv.className = 'wishlist-div'

  newBuyButton.textContent = "buy";
  newBuyButton.className = "buy-btn-logic"; 

  status.textContent = buyStatus;
  status.className = 'status-p'

  nameFinal.textContent = goalName;
  nameFinal.className = 'name-thing';

  divDetail.className = 'div-detail'

  divDetailSub.className = 'div-detail-sub'
  


  newBuyButton.addEventListener('click', function() {
    point = point - price
    totalPoint.innerHTML = point
    status.innerHTML = "✓"
    status.style.color = '#418c47'
    status.style.textShadow = '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff,-1px  1px 0 #000, 1px  1px 0 #000;'
    localStorage.setItem('savedPoints', point);
    saveAllGoals();
  })

  newDiv.appendChild(divImg);
  newDiv.appendChild(divDetail);

  divImg.appendChild(newImage)

  divDetail.appendChild(divDetailSub)
  divDetail.appendChild(divDetailName)

  divDetailSub.appendChild(thingPrice)
  divDetailSub.appendChild(newBuyButton)
  divDetailSub.appendChild(status)
  divDetailName.appendChild(nameFinal)
  
  document.getElementById("flex").appendChild(newDiv)
}

function saveAllGoals() {
    const flexContent = document.getElementById("flex").innerHTML;
    localStorage.setItem('goalCards', flexContent);
}

// This fixes the buttons when you refresh the page
function reattachBuyButtons() {
    const cards = document.querySelectorAll("#flex > div");
    cards.forEach(card => {
        const btn = card.querySelector(".buy-btn-logic");
        const status = card.querySelector("p:last-child");
        const price = parseInt(card.childNodes[0].textContent);

        btn.onclick = function() {
            point = point - price;
            totalPoint.innerHTML = point;
            status.innerHTML = "✓";
            localStorage.setItem('savedPoints', point);
            saveAllGoals();
        };
    });
}

const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener('click', function() {
  localStorage.clear();
  point = 0;
  window.location.reload();
});

const closeBtn = document.getElementById('close');

closeBtn.addEventListener('click', () => {
  window.electronAPI.quitApp();
  });
