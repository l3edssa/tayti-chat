//Contacts CONTROLLER
var contactsController = (function () {
  var Contact = function (id, name) {
    this.id = id;
    this.name = name;
  };
})();

// ChAT CONTROLLER
var chatController = (function () {
  var Message = function (value, time) {
    this.value = value;
    this.time = time;
  };

  return {
    addChat: function (value) {
      var newChat, curTime;
      var d = new Date();
      curTime = `${d.getHours()}:${d.getMinutes()}`;
      newChat = new Message(value, curTime);
      return newChat;
    },
  };
})();

// UI CONTROLLER
var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    msgBtn: ".msg-btn",
    msgText: ".msg-input",
    chatList: ".messages-list__active",
    chatContainer: ".right__center",
    blThumbnail: ".settings-thumbnail", //Bottom left user thumbnail
    logoutPopup: ".logout-popup", //Bottom left user thumbnail
    leftBtnGroup: ".left__wrapper--center",
    leftBtnList: ".icons__wrapper",
    centerContainer: ".center__wrapper",
    rightContainer: ".right__center",
    groupContainer: ".group-list",
    convoName: ".conversation-window-name",
    groupID: "#group1",
  };

  var clearCenter = () => {
    var centerChildren = document.querySelector(
      DOMstrings.centerContainer
    ).children;
    [...centerChildren].forEach((el) => {
      el.classList.add("d-none");
    });
  };

  var clearRight = () => {
    var rightChildren = document.querySelector(
      DOMstrings.rightContainer
    ).children;
    [...rightChildren].forEach((el) => {
      el.classList.add("d-none");
    });
  };

  return {
    getInput: function () {
      return document.querySelector(DOMstrings.msgText).value;
    },

    addChatMessage: function (newMsg) {
      console.log(newMsg);
      var isRight, lastMessage;
      //1. get the last li element in the ul messages list
      lastMessage = document.querySelector(
        DOMstrings.chatList
      ).lastElementChild;

      //2. Check if last message is already a sent message ie. in the right
      isRight = lastMessage.classList.contains("right-chat");

      //3. Prepare markup for insertion
      markup = `
            <li class="right-chat" style="opacity: 0; transform: translateY(20px)">
                <div class="conversation-item u-mb-s">
                    <div class="user-thumbnail"></div>
                    <div class="text__wrap">
                        <div class="text__wrap--content">
                            <p>${newMsg.value}</p>
                            <p class="chat-time"><i class="u-vertical-align ri-time-line"></i><span class="u-vertical-align"> ${newMsg.time}</span></p>
                        </div>
                        <div class="conversation-name">Lalo Salamanca</div>
                    </div>
                </div>
            </li>
            `;

      //4. Remove user thumbnail and name if last message is on the right
      if (isRight) {
        lastMessage.firstElementChild.firstElementChild.classList.add(
          "visi-hidden"
        );
        lastMessage.firstElementChild.lastElementChild.lastElementChild.remove();
      }

      //5. Insert new message
      document
        .querySelector(DOMstrings.chatList)
        .insertAdjacentHTML("beforeend", markup);

      //6. Animating new message insertion fade in from bottom
      lastMessage = document.querySelector(
        DOMstrings.chatList
      ).lastElementChild;
      setTimeout(function () {
        lastMessage.style.opacity = "1";
        lastMessage.style.transform = "translateY(0)";
      }, 10);
    },

    clearMessageInput: function () {
      var field = document.querySelector(DOMstrings.msgText);
      field.value = "";
      field.focus();
    },

    scrollChatContainer: function () {
      var chatScroll = document.querySelector(DOMstrings.chatContainer);
      chatScroll.scrollTop = chatScroll.scrollHeight;
    },

    toggleLogoutPopup: function () {
      var popup = document.querySelector(DOMstrings.logoutPopup);
      popup.classList.toggle("user-thumbnail__popup--shown");
      /* if (popup.classList.contains("d-none")) {
        popup.classList.remove("d-none");
        //popup.style.opacity = "1";
        setTimeout(function () {
          popup.style.opacity = "1";
          popup.style.transform = "translate(5%, -70%)";
        }, 10);
      } else {
        popup.style.opacity = "0";
        setTimeout(function () {
          popup.classList.add("d-none");
          popup.style.transform = "translate(5%, -60%)";
        }, 300);
      } */
    },

    toggleCenterTabs: function (target) {
      //1. check if click target is an i element
      if (target.tagName == "I") {
        //2. check if target grandfather is already the active btn
        if (
          !target.parentNode.parentNode.classList.contains(
            "icons__wrapper--active"
          )
        ) {
          //3. get the list of children btns and the id of the currently selected btn in order to remove the active class from any previous btn and add it to the current clicked
          var btnList = document.querySelector(DOMstrings.leftBtnList).children;
          var id = target.parentNode.parentNode.id;

          //4. loop throught btns to remove the active class
          for (var i = 0; i < btnList.length; i++) {
            if (btnList[i].classList.contains("icons__wrapper--active"))
              btnList[i].classList.remove("icons__wrapper--active");
          }

          //5. add the active class to the current clicked btn
          target.parentNode.parentNode.classList.add("icons__wrapper--active");

          //6. display the appropriate window for the selected btn
          clearCenter();
          if (document.querySelector(`.${id}`))
            document.querySelector(`.${id}`).classList.remove("d-none");
        }
      }
    },

    addGroupChat: function () {
      clearRight();
      document
        .querySelector(DOMstrings.groupContainer)
        .classList.remove("d-none");
    },

    ctrlConversations: function (target) {
      if (target.classList.contains("chat-name")) {
        var convoName = target.innerHTML;
        document.querySelector(DOMstrings.convoName).innerHTML = convoName;

        if (target.parentNode.parentNode.id == "group1") {
          clearRight();
          document
            .querySelector(DOMstrings.groupContainer)
            .classList.remove("d-none");
          document
            .querySelector(DOMstrings.groupContainer)
            .classList.add("messages-list__active");
          document
            .querySelector(".users-list")
            .classList.remove("messages-list__active");
        } else {
          clearRight();
          document.querySelector(".users-list").classList.remove("d-none");
          document
            .querySelector(".users-list")
            .classList.add("messages-list__active");
          document
            .querySelector(DOMstrings.groupContainer)
            .classList.remove("messages-list__active");
        }
      }
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function (Cc, UIC) {
  var setupEventListeners = function () {
    UIC.scrollChatContainer();
    var DOM = UIC.getDOMstrings();
    document
      .getElementsByTagName("form")[0]
      .addEventListener("click", function (event) {
        event.preventDefault();
        //ctrlAddChatMsg();
      });

    document
      .querySelector(DOM.msgBtn)
      .addEventListener("click", ctrlAddChatMsg);
    document
      .querySelector(DOM.msgText)
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          ctrlAddItem();
        }
      });
    document
      .querySelector(DOM.blThumbnail)
      .addEventListener("click", ctrlTogglePopup);
    document
      .querySelector(DOM.leftBtnGroup)
      .addEventListener("click", function (e) {
        ctrlCenterLayout(e.target);
      });
    document
      .querySelector(DOM.centerContainer)
      .addEventListener("click", function (e) {
        ctrlConversations(e.target);
      });
    /* document
      .querySelector(DOM.groupID)
      .addEventListener("click", switchToGroupChat); */
  };

  var ctrlAddChatMsg = () => {
    var input, newMsg;

    //1. Get message field input data
    input = UIC.getInput();
    if (input) {
      //2. Add chat message to chat controller
      newMsg = Cc.addChat(input);

      //3. Add chat message to UI
      UIC.addChatMessage(newMsg);
      UIC.scrollChatContainer();
      UIC.clearMessageInput();
    }
  };

  var ctrlTogglePopup = () => {
    UIC.toggleLogoutPopup();
  };

  var ctrlCenterLayout = (target) => {
    UIC.toggleCenterTabs(target);
  };

  /* var switchToGroupChat = () => {
    //1. clearchat area

    //2. add new chat
    UIC.addGroupChat();
  }; */

  var ctrlConversations = (target) => {
    //console.log(target);
    UIC.ctrlConversations(target);
    UIC.scrollChatContainer();
  };

  return {
    init: function () {
      console.log("App started");
      setupEventListeners();
    }
  };
})(chatController, UIController);

controller.init();