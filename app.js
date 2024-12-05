const blurStatus = 'blurred';
const blurClass = 'blur-enabled';
const regex = /^[a-zA-Z0-9_-]{6,30}$|^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const sensitiveClass = 'blur-sensitive';
const blurCss = 'filter: blur(6px);';
const style = document.createElement('style'); 
style.appendChild(document.createTextNode(''));
document.head.appendChild(style);
style.sheet.insertRule(`.${blurClass} .blur-sensitive { ${blurCss} }`); 

function storageBlurStatus(cb) {
  chrome.storage.local.get(blurStatus, items => {
    const { blurred } = items;
    if (typeof blurred !== 'boolean') {
      chrome.storage.local.set({ [blurStatus]: true }, () =>
        cb(true)
      );
    } else {
      cb(blurred);
    }
  });
}
storageBlurStatus(x => { x ? document.body.classList.add(blurClass) : document.body.classList.remove(blurClass);});

function blurSensitiveData(e) {
  const inputElement = e.target;
  if (regex.test(inputElement.value)) {
    inputElement.classList.add(sensitiveClass);
  } else {
    inputElement.classList.remove(sensitiveClass);
  }
}

function addBlurToLoginInputs() {
  const passwordInput = document.querySelector(
    'input[type="password"], input[type="pass"], input[type="login-password"], input[type="input-password"], ' +
    'input[name="password"], input[name="pass"], input[name="login_password"], input[name="login-password"], input[name="input-password"], input[name="user_password"], ' +
    '#password, #pass, #login-password, #input-password'
  );
  if (passwordInput) {
    const potentialLoginInputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"], input[type="pass"], input[type="login-password"], input[type="input-password"], ' + 
      'input[name="username"], input[name="user"], input[name="login"], input[name="email"], ' +
      'input[name="input-username"], input[name="user_id"], input[name="login-username"], input[name="user-email"], input[name="user_email"], input[name="login_email"], input[name="login-email"], input[name="input-email"], ' +
      'input[name="password"], input[name="pass"], input[name="login_password"], input[name="login-password"], input[name="input-password"], input[name="user_password"]' +
      '#username, #user, #userId, #login, #email, ' +
      '#user-email, #login-email, #login-user, #input-username, #username-input, #input-email, ' +
      '#password, #pass, #login-password, #input-password'
    );
    potentialLoginInputs.forEach(input => {
      input.addEventListener("input", blurSensitiveData);
      if (input.value) {
        blurSensitiveData({ target: input });
      }
    });
  }
}

const observer = new MutationObserver(addBlurToLoginInputs);
const config = { childList: true, subtree: true };
observer.observe(document.body, config);

addBlurToLoginInputs();
