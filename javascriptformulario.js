/* == UI - Elements == */
const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const signInWithGoogleButtonEl = document.getElementById(
  "sign-in-with-google-btn"
);

const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");

const mensajesErrorEl = document.getElementById("mensajesError");

const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");

const signOutButtonEl = document.getElementById("sign-out-btn");

const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl = document.getElementById("user-greeting");

const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn");
const textareaEl = document.getElementById("post-input");
const postButtonEl = document.getElementById("post-btn");

const postsEl = document.getElementById("posts");

/* == UI - Event Listeners == */

for (let moodEmojiEl of moodEmojiEls) {
  moodEmojiEl.addEventListener("click", selectMood);
}

postButtonEl.addEventListener("click", postButtonPressed);
signInButtonEl.addEventListener("click", login);
signOutButtonEl.addEventListener("click", logout);

/* === State === */

let moodState = 0;

/* === Global Constants === */

const collectionName = "posts";

/* === Main Code === */

console.log("Iniciando");
showLoggedOutView();

/* === Functions === */

/* = Functions - Firebase - Authentication = */
function login() {
  const email = emailInputEl.value;
  const pass = passwordInputEl.value;

  if (email === "carlix@gmail.com" && pass === "ajax") {
    showLoggedInView();
  } else {
    console.log("Error");
    mensajesErrorEl.innerHTML = "Error! Credenciales incorrectas";
  }
}

function logout() {
  clearAuthFields();
  showLoggedOutView();
}

/* = Functions - Firebase - Cloud Firestore = */

/* == Functions - UI Functions == */

function renderPost(postsEl, postData) {
  postsEl.innerHTML += `
        <div class="post">
            <div class="header">
                <h3>${postData.createdAt}</h3>
                <img src="assets/emojis/${postData.mood}.png" alt="mood emoji">
            </div>
            <p>
                ${replaceNewlinesWithBrTags(postData.body)}
            </p>
        </div>
    `;
}

function replaceNewlinesWithBrTags(inputString) {
  return inputString.replace(/\n/g, "<br>");
}

function postButtonPressed() {
  const postBody = textareaEl.value;

  if (postBody && moodState) {
    const obj = new Object();
    obj.createdAt = new Date(); 
    obj.mood = moodState;       
    obj.body = postBody;
    renderPost(postsEl, obj);   
    clearInputField(textareaEl);
    resetAllMoodElements(moodEmojiEls);
  }
}

function clearAll(element) {
  element.innerHTML = "";
}

function showLoggedOutView() {
  hideView(viewLoggedIn);
  showView(viewLoggedOut);
}

function showLoggedInView() {
  hideView(viewLoggedOut);
  showView(viewLoggedIn);
}

function showView(view) {
  view.style.display = "flex";
}

function hideView(view) {
  view.style.display = "none";
}

function clearInputField(field) {
  field.value = "";
}

function clearAuthFields() {
  clearInputField(emailInputEl);
  clearInputField(passwordInputEl);
  mensajesErrorEl.innerHTML = "";
}

function showProfilePicture(imgElement, user) {
  const photoURL = user.photoURL;

  if (photoURL) {
    imgElement.src = photoURL;
  } else {
    imgElement.src = "assets/images/default-profile-picture.jpeg";
  }
}

function showUserGreeting(element, user) {
  const displayName = user.displayName;

  if (displayName) {
    const userFirstName = displayName.split(" ")[0];

    element.textContent = `Hey ${userFirstName}, how are you?`;
  } else {
    element.textContent = `Hey friend, how are you?`;
  }
}

function displayDate(firebaseDate) {
  if (!firebaseDate) {
    return "Date processing";
  }

  const date = firebaseDate.toDate();

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day} ${month} ${year} - ${hours}:${minutes}`;
}

/* = Functions - UI Functions - Mood = */

function selectMood(event) {
  const selectedMoodEmojiElementId = event.currentTarget.id;

  changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiEls);

  const chosenMoodValue = returnMoodValueFromElementId(selectedMoodEmojiElementId);

  moodState = chosenMoodValue;
}

function changeMoodsStyleAfterSelection(
  selectedMoodElementId,
  allMoodElements
) {
  for (let moodEmojiEl of moodEmojiEls) {
    if (selectedMoodElementId === moodEmojiEl.id) {
      moodEmojiEl.classList.remove("unselected-emoji");
      moodEmojiEl.classList.add("selected-emoji");
    } else {
      moodEmojiEl.classList.remove("selected-emoji");
      moodEmojiEl.classList.add("unselected-emoji");
    }
  }
}

function resetAllMoodElements(allMoodElements) {
  for (let moodEmojiEl of allMoodElements) {
    moodEmojiEl.classList.remove("selected-emoji");
    moodEmojiEl.classList.remove("unselected-emoji");
  }

  moodState = 0;
}

function returnMoodValueFromElementId(elementId) {
  return Number(elementId.slice(5));
}
