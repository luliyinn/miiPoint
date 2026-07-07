let point = parseInt(localStorage.getItem('savedPoints')) || 0; 
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
totalPoint.innerHTML = point;
const savedGoalsHTML = localStorage.getItem('goalCards');
if (savedGoalsHTML) {
    document.getElementById("flex").innerHTML = savedGoalsHTML;
    reattachBuyButtons();
    reattachDeleteButtons();
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
  localStorage.setItem('savedPoints', point);
}

input.addEventListener('change', function() {
  let file = this.files[0];
  if (file) {
    const reader = new FileReader(); 
    reader.onload = function(e) {
        imageURL = e.target.result; 
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
  newImage.style.maxWidth = '100px'
  newImage.style.marginLeft = 'auto'
  newImage.style.marginRight = 'auto'
  newImage.style.display = 'block'

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
      document.getElementById('confirmation-2').style.display = 'none';
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

function reattachBuyButtons() {
    const cards = document.querySelectorAll("#flex > div");

    cards.forEach(card => {
        const btn = card.querySelector(".buy-btn-logic");
        const status = card.querySelector(".status-p");
        const price = parseInt(card.querySelector(".price-p").textContent);

        btn.onclick = function() {
            point -= price;
            totalPoint.innerHTML = point;
            status.innerHTML = "✓";
            status.style.color = '#418c47';

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
    const pointsToAdd = parseInt(pointVal) || 0;
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
  const currentPoint = pointsEarned.value || "0";
  const currentName = taskName.value || "unnamed task";
  const currentColor = taskColor.value || "#ffffff";

  const newTaskObj = {
    point: currentPoint,
    name: currentName,
    color: currentColor
  };

  taskList.push(newTaskObj);

  localStorage.setItem('mytaskList', JSON.stringify(taskList));

  createTaskElement(currentPoint, currentName, currentColor);

  pointValue = '';
  nameValue = '';
  colorValue = '';
}

taskAdd.addEventListener('click', savelocalStorage);

const resetBtnPts = document.getElementById("reset-btn-pts");

resetBtnPts.addEventListener('click', function() {
  localStorage.removeItem("savedPoints");
  point = 0;
  window.location.reload();
});

const helpDiv = document.getElementById("help-div")
const helpBtn = document.getElementById("help")

helpBtn.addEventListener('click', function() {
  if (helpDiv.style.display == 'block') {
    helpDiv.style.display = 'none'
  } else {
    helpDiv.style.display = 'block'
  }
  

})

const taskInfoBtn = document.getElementById("task-info-btn")
const taskInfoDiv = document.getElementById("task-info")

taskInfoBtn.addEventListener('click', function() {
  if (taskInfoDiv.style.display == 'block') {
    taskInfoDiv.style.display = 'none'
  } else {
    taskInfoDiv.style.display = 'block'
  }
})

const wishInfoBtn = document.getElementById("wishlist-info-btn")
const wishInfoDiv = document.getElementById("wishlist-info")

wishInfoBtn.addEventListener('click', function() {
  if (wishInfoDiv.style.display == 'block') {
    wishInfoDiv.style.display = 'none'
  } else {
    wishInfoDiv.style.display = 'block'
  }
})

const otherBtn = document.getElementById("other-btn")
const otherDiv = document.getElementById("other-info")

otherBtn.addEventListener('click', function() {
  if (otherDiv.style.display == 'block') {
    otherDiv.style.display = 'none'
  } else {
    otherDiv.style.display = 'block'
  }
})

document.getElementById("close-info").addEventListener('click', function() {
  helpDiv.style.display = 'none'
})

function reattachDeleteButtons() {
    const cards = document.querySelectorAll("#flex .wishlist-div");

    cards.forEach(card => {
        card.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            document.getElementById('confirmation-2').style.display = 'block';

            document.getElementById('yes-btn-2').onclick = function() {
                card.remove();
                saveAllGoals();
                document.getElementById('confirmation-2').style.display = 'none';
            };

            document.getElementById('no-btn-2').onclick = function() {
                document.getElementById('confirmation-2').style.display = 'none';
            };
        });
    });
}










