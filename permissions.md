# Permissions

This document explains the need for each [permission](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/) declared in Maskerade's [extension manifest file](manifest.json).

## Host

The host permission `https://*/*` is required for the extension to run content scripts on all Https websites. Since the extension’s primary function is to apply a blurring effect to sensitive login details, which are typically entered on secured (Https) pages, this permission enables it to work across any Https website.

From the user's perspective, this permission ensures that the extension can consistently protect their privacy by blurring login details on all secure websites, providing reliable privacy protection wherever they enter sensitive information.

## Scripting

This permission is required to allow the extension to dynamically add or remove a class that blurs sensitive login information when the user visits a login page. By enabling the extension, the user can toggle this functionality on or off, which alters the page's content to enhance privacy by blurring details such as email addresses or usernames. Without this permission, the extension would not have the ability to modify the content of the web page, and the blur effect would not be applied.

Specifically, the extension utilizes the [chrome.scripting.executeScript](https://developer.chrome.com/docs/extensions/reference/api/scripting) API in the [popout.js](popout/popout.js) file to inject or remove a class called `blur-enabled`, which triggers the blurring effect. This is essential for the proper functioning of the extension and safeguarding user data on login pages.

## Tabs

This permission is required to allow the extension to identify the active tab and apply the blurring effect only to that specific tab. This ensures that the extension modifies the content of the tab the user is currently viewing, rather than affecting all open tabs, preserving a focused and relevant user experience.

More specifically, in the [popout.js](popout/popout.js) file, the [chrome.tabs.query](https://developer.chrome.com/docs/extensions/reference/api/tabs) API is used to retrieve information about the active tab in the current window. This information is then utilized to add or remove a class that blurs the user's login details, enhancing privacy on the selected tab.

## Storage

This permission is necessary to persist the state of the blurring effect (enabled or disabled) across browser sessions. By storing this preference, the extension ensures that a user's choice, whether to blur login details or not, is remembered even after they close and re-open the browser. This allows for a seamless and consistent experience without requiring the user to reconfigure the extension each time they use it.

Specifically, the [chrome.storage.local](https://developer.chrome.com/docs/extensions/reference/api/storage) API is utilized to store and retrieve the masking status, reflecting whether the user has toggled the extension on or off.