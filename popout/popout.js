const p = document.querySelector('p');
let blurEnabled = true;
let blurCheckbox = document.getElementById('toggle_checkbox');

chrome.storage.local.get('blurred', (data) => {
  if (data.blurred !== undefined) {
    blurEnabled = data.blurred;
    blurCheckbox.checked = blurEnabled;
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId, allFrames: true },
        func: () => document.body.classList.contains('blur-enabled')
      },
      (results) => {
        if (results && results[0].result) { 
          const blurEnabled = results[0].result;
          blurCheckbox.checked = blurEnabled;
        }
      }
    );
  }
});

function toggleBlur() {
  blurEnabled = !blurEnabled;
  chrome.storage.local.set({ blurred: blurEnabled }, () => {blurEnabled ? enableBlur() : disableBlur();});
}

function enableBlur() {
  chrome.action.setBadgeText({ text: 'On' });
  chrome.action.setBadgeBackgroundColor({ color: '#00b300' });
  chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        func: () => document.body.classList.add('blur-enabled')
      });
    }
  });
  p.style.opacity = '1';
  p.textContent = "Masked";
  fade();
}

function disableBlur() {
  chrome.action.setBadgeText({ text: 'Off' });
  chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
  chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        func: () => document.body.classList.remove('blur-enabled')
      });
    }
  });
  p.style.opacity = '1';
  p.textContent = "Unmasked";
  fade();
}

function fade() {
  let fadeEffect = setInterval(function () {
      if (!p.style.opacity) {
          p.style.opacity = 1;
      }
      if (p.style.opacity > 0) {
          p.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 100);
}

blurCheckbox.addEventListener('click', toggleBlur);