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

const newTask = document.getElementById("new-task");
const hideTask = document.getElementById("hide-task")
const taskDiv = document.getElementById("task-inp")

const input = document.getElementById("imageinput");
const preview = document.getElementById("preview");
const newGoalContainer = document.getElementById("image-inp");

const setNewPoint = document.getElementById("set-point");
const doneButton = document.getElementById("done-btn");
const nameInput = document.getElementById("name")

const pointsEarned = document.getElementById("points-earned");
const taskName = document.getElementById("task-name");
const taskColor = document.getElementById("task-color");
const taskAdd = document.getElementById("task-add");

const testPlaceholder = document.getElementById("test-placeholder");

let taskList = JSON.parse(localStorage.getItem('mytaskList')) || [];
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

newTask.addEventListener('click', function() {
  taskDiv.style.display = 'block';
  newTask.style.display = 'none'
  hideTask.style.display = 'block'
})

hideGoal.addEventListener('click', function() {
  newGoalContainer.style.display = 'none';
  newGoal.style.display = 'block'
  hideGoal.style.display = 'none'
})

hideTask.addEventListener('click', function() {
  taskDiv.style.display = 'none';
  newTask.style.display = 'block'
  hideTask.style.display = 'none'
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

  newDiv.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    document.getElementById('confirmation-2').style.display = 'block'

      document.getElementById('yes-btn-2').onclick = function() {
      newDiv.remove();
      saveAllGoals();
      confirmBox.style.display = 'none';
    };

    document.getElementById('no-btn-2').onclick = function() {
      document.getElementById('confirmation-2').style.display = 'none'
    }

  })
  
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

function createTaskElement(pointVal, nameVal, colorVal) {
  const newTask = document.createElement('button');
  newTask.innerHTML = pointVal + " || " + nameVal;
  newTask.style.backgroundImage = `linear-gradient(to bottom, #ffffff, ${colorVal})`
  newTask.className = 'saved-task-item'; 

  newTask.addEventListener('click', function() {
    // Convert the pointVal string into a clean integer number
    const pointsToAdd = parseInt(pointVal) || 0;
    
    // Use your existing addPoint function to update total points and save
    addPoint(pointsToAdd); 
  });

  newTask.addEventListener('contextmenu', function(e) {
    e.preventDefault(); 
    document.getElementById('confirmation').style.display = 'block'

    document.getElementById('yes-btn').addEventListener('click', function() {
      newTask.remove()
      taskList = taskList.filter(task => !(task.point === pointVal && task.name === nameVal && task.color === colorVal));
      localStorage.setItem('mytaskList', JSON.stringify(taskList));
      document.getElementById('confirmation').style.display = 'none'
    })

    document.getElementById('no-btn').addEventListener('click', function() {
      document.getElementById('confirmation').style.display = 'none'
    })
    
  })
  document.getElementById('task-div').appendChild(newTask);
}

window.addEventListener('DOMContentLoaded', () => {
  taskList.forEach(task => {
    // goal.point, goal.name, and goal.color come from our saved data structure
    createTaskElement(task.point, task.name, task.color);
  });
});

let pointValue = '';
let nameValue = '';
let colorValue = '';

pointsEarned.addEventListener('input', function() { pointValue = pointsEarned.value; });
taskName.addEventListener('input', function() { nameValue = taskName.value; });
taskColor.addEventListener('input', function() { colorValue = taskColor.value; });

function savelocalStorage() {
  // 1. Grab values directly from inputs immediately on click (Prevents empty/blank bugs)
  const currentPoint = pointsEarned.value || "0";
  const currentName = taskName.value || "Unnamed Task";
  const currentColor = taskColor.value || "#ffffff";

  // 2. Build the object using clean variables
  const newTaskObj = {
    point: currentPoint,
    name: currentName,
    color: currentColor
  };

  // 3. Push the new object into your list array
  taskList.push(newTaskObj);

  // 4. Save the updated list array to localStorage
  localStorage.setItem('mytaskList', JSON.stringify(taskList));

  // 5. Draw the new button element on the screen right away
  createTaskElement(currentPoint, currentName, currentColor);

  // 7. Reset global tracking variables
  pointValue = '';
  nameValue = '';
  colorValue = '';
}

// Attach the function to your button click
taskAdd.addEventListener('click', savelocalStorage);

const resetBtnPts = document.getElementById("reset-btn-pts");

resetBtnPts.addEventListener('click', function() {
  localStorage.removeItem("savedPoints");
  point = 0;
  window.location.reload();
});









