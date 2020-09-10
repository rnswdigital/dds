(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('NSW', ['exports'], factory) :
  (global = global || self, factory(global.NSW = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var SiteSearch = /*#__PURE__*/function () {
    function SiteSearch(element) {
      _classCallCheck(this, SiteSearch);

      this.triggerButton = element;
      this.originalButton = document.querySelector('.js-open-search');
      this.targetElement = document.getElementById(this.triggerButton.getAttribute('aria-controls'));
      this.searchInput = this.targetElement.querySelector('.js-search-input');
      this.pressed = this.triggerButton.getAttribute('aria-expanded') === 'true';
    }

    _createClass(SiteSearch, [{
      key: "init",
      value: function init() {
        this.controls();
      }
    }, {
      key: "controls",
      value: function controls() {
        this.triggerButton.addEventListener('click', this.showHide.bind(this), false);
      }
    }, {
      key: "showHide",
      value: function showHide() {
        if (this.pressed) {
          this.targetElement.hidden = true;
          this.originalButton.hidden = false;
          this.originalButton.focus();
        } else {
          this.targetElement.hidden = false;
          this.originalButton.hidden = true;
          this.searchInput.focus();
        }
      }
    }]);

    return SiteSearch;
  }();

  var focusObjectGenerator = function focusObjectGenerator(arr) {
    var focusableElements = {
      all: arr,
      first: arr[0],
      last: arr[arr.length - 1],
      length: arr.length
    };
    return focusableElements;
  };
  var getFocusableElementBySelector = function getFocusableElementBySelector(id, selectorArr) {
    var _ref;

    var elements = [];

    for (var i = 0; i < selectorArr.length; i += 1) {
      elements.push([].slice.call(document.querySelectorAll("#".concat(id, " ").concat(selectorArr[i]))));
    }

    var mergedElementArr = (_ref = []).concat.apply(_ref, elements);

    return focusObjectGenerator(mergedElementArr);
  };
  var trapTabKey = function trapTabKey(event, focusObject) {
    var _document = document,
        activeElement = _document.activeElement;
    var focusableElement = focusObject;
    if (event.keyCode !== 9) return false;

    if (focusableElement.length === 1) {
      event.preventDefault();
    } else if (event.shiftKey && activeElement === focusableElement.first) {
      focusableElement.last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && activeElement === focusableElement.last) {
      focusableElement.first.focus();
      event.preventDefault();
    }

    return true;
  };
  var whichTransitionEvent = function whichTransitionEvent() {
    var el = document.createElement('fakeelement');
    var transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    };
    var found = Object.keys(transitions).filter(function (key) {
      return el.style[key] !== undefined;
    });
    return transitions[found[0]];
  };
  var uniqueId = function uniqueId(prefix) {
    var prefixValue = prefix === undefined ? 'nsw' : prefix;
    return "".concat(prefixValue, "-").concat(Math.random().toString(36).substr(2, 16));
  };
  var popupWindow = function popupWindow(url, width, height) {
    var y = window.top.outerHeight / 2 + window.top.screenY - height / 2;
    var x = window.top.outerWidth / 2 + window.top.screenX - width / 2;
    window.open(url, '', "toolbar=no,location=no,directories=no, status=no,\n    menubar=no, scrollbars=no, resizable=no, copyhistory=no,\n    width=".concat(width, ", height=").concat(height, ", top=").concat(y, ", left=").concat(x));
  };

  var Navigation = /*#__PURE__*/function () {
    function Navigation() {
      var _this = this;

      _classCallCheck(this, Navigation);

      this.openNavButton = document.querySelector('.js-open-navigation');
      this.closeNavButtons = document.querySelectorAll('.js-close-navigation');
      this.openSubnavButtons = document.querySelectorAll('.js-open-subnav');
      this.closeSubnavButtons = document.querySelectorAll('.js-close-subnav');
      this.mainNavElement = document.getElementById('main-navigation');
      this.isMegaMenuElement = !!document.querySelector('.js-mega-menu');
      this.transitionEvent = whichTransitionEvent();

      this.mobileToggleMainNavEvent = function (e) {
        return _this.mobileToggleMainNav(e);
      };

      this.mobileToggleSubnavEvent = function () {
        return _this.closeSubnav();
      };

      this.mobileShowMainTransitionEndEvent = function (e) {
        return _this.mobileShowMainNav(e);
      };

      this.mobileHideMainTransitionEndEvent = function (e) {
        return _this.mobileHideMainNav(e);
      };

      this.showSubNavTransitionEndEvent = function (e) {
        return _this.showSubNav(e);
      };

      this.mobileTrapTabKeyEvent = function (e) {
        return _this.mobileMainNavTrapTabs(e);
      };

      this.mobileSubNavTrapTabKeyEvent = function (e) {
        return _this.trapkeyEventStuff(e);
      };

      this.desktopButtonClickEvent = function (e) {
        return _this.buttonClickDesktop(e);
      };

      this.desktopButtonKeydownEvent = function (e) {
        return _this.buttonKeydownDesktop(e);
      };

      this.checkFocusEvent = function (e) {
        return _this.checkIfContainsFocus(e);
      };

      this.escapeCloseEvent = function (e) {
        return _this.escapeClose(e);
      };

      this.openSubNavElements = [];
      this.breakpoint = window.matchMedia('(min-width: 48em)');
      this.body = document.body;
    }

    _createClass(Navigation, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        if (this.mainNavElement) {
          this.setUpMobileControls();
          this.responsiveCheck(this.breakpoint);
          this.breakpoint.addListener(function (e) {
            return _this2.responsiveCheck(e);
          });
        }
      }
    }, {
      key: "responsiveCheck",
      value: function responsiveCheck(e) {
        var megaMenuListItems = [];

        if (e.matches) {
          megaMenuListItems = [].slice.call(this.mainNavElement.querySelectorAll('.nsw-navigation__list > li'));
          this.body.classList.remove('navigation-open');
        } else {
          megaMenuListItems = [].slice.call(this.mainNavElement.querySelectorAll('li'));
        }

        this.tearDownNavControls();
        this.setUpNavControls(megaMenuListItems);
      }
    }, {
      key: "tearDownNavControls",
      value: function tearDownNavControls() {
        var _this3 = this;

        if (this.isMegaMenuElement) {
          var listItems = [].slice.call(this.mainNavElement.querySelectorAll('li'));
          listItems.forEach(function (item) {
            var submenu = item.querySelector('[id^=subnav-]');
            var link = item.querySelector('a');

            if (submenu) {
              link.removeAttribute('role');
              link.removeAttribute('aria-expanded');
              link.removeAttribute('aria-controls');
              link.removeEventListener('click', _this3.desktopButtonClickEvent, false);
              link.removeEventListener('keydown', _this3.desktopButtonKeydownEvent, false);
            }
          });
        }
      }
    }, {
      key: "setUpMobileControls",
      value: function setUpMobileControls() {
        var _this4 = this;

        this.openNavButton.addEventListener('click', this.mobileToggleMainNavEvent, false);
        this.closeNavButtons.forEach(function (element) {
          element.addEventListener('click', _this4.mobileToggleMainNavEvent, false);
        });
        this.closeSubnavButtons.forEach(function (element) {
          element.addEventListener('click', _this4.mobileToggleSubnavEvent, false);
        });
      }
    }, {
      key: "mobileMainNavTrapTabs",
      value: function mobileMainNavTrapTabs(e) {
        var elemObj = getFocusableElementBySelector(this.mainNavElement.id, ['> div button', '> ul > li > a']);
        trapTabKey(e, elemObj);
      }
    }, {
      key: "setUpNavControls",
      value: function setUpNavControls(listItems) {
        var _this5 = this;

        if (this.isMegaMenuElement) {
          listItems.forEach(function (item) {
            var submenu = item.querySelector('[id^=subnav-]');
            var link = item.querySelector('a');

            if (submenu) {
              link.setAttribute('role', 'button');
              link.setAttribute('aria-expanded', 'false');
              link.setAttribute('aria-controls', submenu.id);
              link.addEventListener('click', _this5.desktopButtonClickEvent, false);
              link.addEventListener('keydown', _this5.desktopButtonKeydownEvent, false);
              document.addEventListener('keydown', _this5.escapeCloseEvent, false);
            }
          });
        }
      }
    }, {
      key: "mobileShowMainNav",
      value: function mobileShowMainNav(_ref) {
        var propertyName = _ref.propertyName;
        if (!propertyName === 'transform') return;
        getFocusableElementBySelector(this.mainNavElement.id, ['> div button', '> ul > li > a']).all[1].focus();
        this.mainNavElement.classList.add('is-open');
        this.mainNavElement.classList.remove('is-opening');
        this.mainNavElement.removeEventListener(this.transitionEvent, this.mobileShowMainTransitionEndEvent, false);
        this.mainNavElement.addEventListener('keydown', this.mobileTrapTabKeyEvent, false);
      }
    }, {
      key: "mobileHideMainNav",
      value: function mobileHideMainNav(_ref2) {
        var propertyName = _ref2.propertyName;
        if (!propertyName === 'transform') return;
        this.mainNavElement.classList.remove('is-open');
        this.mainNavElement.classList.remove('is-closing');

        while (this.openSubNavElements.length > 0) {
          var _this$whichSubNavLate = this.whichSubNavLatest(),
              submenu = _this$whichSubNavLate.submenu;

          submenu.removeEventListener('keydown', this.mobileSubNavTrapTabKeyEvent, false);
          submenu.classList.remove('is-open');
          submenu.classList.remove('is-closing');
          this.openSubNavElements.pop();
        }

        this.mainNavElement.removeEventListener(this.transitionEvent, this.mobileHideMainTransitionEndEvent, false);
        this.mainNavElement.removeEventListener('keydown', this.mobileTrapTabKeyEvent, false);
      }
    }, {
      key: "mobileToggleMainNav",
      value: function mobileToggleMainNav(e) {
        var currentTarget = e.currentTarget;
        var isExpanded = currentTarget.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          this.body.classList.remove('navigation-open');
          this.openNavButton.focus();
          this.mainNavElement.classList.add('is-closing');
          this.mainNavElement.addEventListener(this.transitionEvent, this.mobileHideMainTransitionEndEvent, false);
        } else {
          this.body.classList.add('navigation-open');
          this.mainNavElement.classList.add('is-opening');
          this.mainNavElement.addEventListener(this.transitionEvent, this.mobileShowMainTransitionEndEvent, false);
        }
      }
    }, {
      key: "buttonClickDesktop",
      value: function buttonClickDesktop(e) {
        this.saveElements(e);
        this.toggleSubnavDesktop();
        e.preventDefault();
      }
    }, {
      key: "buttonKeydownDesktop",
      value: function buttonKeydownDesktop(e) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
          this.saveElements(e);
          this.toggleSubnavDesktop();
          e.preventDefault();
        }
      }
    }, {
      key: "escapeClose",
      value: function escapeClose(e) {
        if (e.key === 'Escape') {
          var _this$whichSubNavLate2 = this.whichSubNavLatest(),
              link = _this$whichSubNavLate2.link;

          var isExpanded = link.getAttribute('aria-expanded') === 'true';

          if (isExpanded) {
            this.toggleSubnavDesktop(true);
            e.preventDefault();
            link.focus();
          }
        }
      }
    }, {
      key: "saveElements",
      value: function saveElements(e) {
        var currentTarget = e.currentTarget;
        var temp = {
          submenu: document.getElementById(currentTarget.getAttribute('aria-controls')),
          link: currentTarget,
          linkParent: currentTarget.parentNode
        };
        this.openSubNavElements.push(temp);
      }
    }, {
      key: "showSubNav",
      value: function showSubNav(_ref3) {
        var propertyName = _ref3.propertyName;

        var _this$whichSubNavLate3 = this.whichSubNavLatest(),
            submenu = _this$whichSubNavLate3.submenu;

        if (!propertyName === 'transform') return;
        getFocusableElementBySelector(submenu.id, ['> div button', '> h2 a', '> ul > li > a']).all[2].focus();
        submenu.removeEventListener(this.transitionEvent, this.showSubNavTransitionEndEvent, false);
      }
    }, {
      key: "closeSubnav",
      value: function closeSubnav() {
        var _this$whichSubNavLate4 = this.whichSubNavLatest(),
            submenu = _this$whichSubNavLate4.submenu,
            link = _this$whichSubNavLate4.link;

        if (this.breakpoint.matches) {
          link.setAttribute('aria-expanded', false);
          link.classList.remove('is-open');
          this.mainNavElement.removeEventListener('focus', this.checkFocusEvent, true);
        } else {
          link.focus();
          submenu.removeEventListener('keydown', this.mobileSubNavTrapTabKeyEvent, false);
        }

        submenu.classList.remove('is-open');
        this.openSubNavElements.pop();
      }
    }, {
      key: "opensubnav",
      value: function opensubnav() {
        var _this$whichSubNavLate5 = this.whichSubNavLatest(),
            submenu = _this$whichSubNavLate5.submenu,
            link = _this$whichSubNavLate5.link;

        if (this.breakpoint.matches) {
          link.setAttribute('aria-expanded', true);
          link.classList.add('is-open');
          this.mainNavElement.addEventListener('focus', this.checkFocusEvent, true);
        } else {
          submenu.addEventListener('keydown', this.mobileSubNavTrapTabKeyEvent, false);
          submenu.addEventListener(this.transitionEvent, this.showSubNavTransitionEndEvent, false);
        }

        submenu.classList.add('is-open');
      }
    }, {
      key: "toggleSubnavDesktop",
      value: function toggleSubnavDesktop() {
        var _this$whichSubNavLate6 = this.whichSubNavLatest(),
            link = _this$whichSubNavLate6.link;

        var isExpanded = link.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          this.closeSubnav();
        } else {
          this.opensubnav();
        }
      }
    }, {
      key: "checkIfContainsFocus",
      value: function checkIfContainsFocus() {
        var _this$whichSubNavLate7 = this.whichSubNavLatest(),
            linkParent = _this$whichSubNavLate7.linkParent;

        var focusWithin = linkParent.contains(document.activeElement);

        if (!focusWithin) {
          this.toggleSubnavDesktop(true);
        }
      }
    }, {
      key: "whichSubNavLatest",
      value: function whichSubNavLatest() {
        var lastSubNav = this.openSubNavElements.length - 1;
        return this.openSubNavElements[lastSubNav];
      }
    }, {
      key: "trapkeyEventStuff",
      value: function trapkeyEventStuff(e) {
        var _this$whichSubNavLate8 = this.whichSubNavLatest(),
            submenu = _this$whichSubNavLate8.submenu;

        var elemObj = getFocusableElementBySelector(submenu.id, ['> div button', '> ul > li > a']);
        trapTabKey(e, elemObj);
      }
    }]);

    return Navigation;
  }();

  function createButtons(_ref) {
    var textContent = _ref.textContent;
    var fragment = document.createDocumentFragment();
    var button = document.createElement('button');
    var uID = uniqueId('accordion');
    button.textContent = textContent;
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', uID);
    button.classList.add('nsw-accordion__button');
    button.insertAdjacentHTML('beforeend', "\n  <svg class=\"nsw-icon nsw-accordion__icon\" focusable=\"false\" aria-hidden=\"true\">\n    <use xlink:href=\"#chevron\"></use>\n  </svg>\n  ");
    fragment.appendChild(button);
    return fragment;
  }

  var Accordion = /*#__PURE__*/function () {
    function Accordion(element) {
      var _this = this;

      _classCallCheck(this, Accordion);

      this.accordionHeadingClass = '.nsw-accordion__title';
      this.accordion = element;
      this.headings = element.querySelectorAll(this.accordionHeadingClass);
      this.buttons = [];
      this.content = [];

      this.showHideEvent = function (e) {
        return _this.showHide(e);
      };
    }

    _createClass(Accordion, [{
      key: "init",
      value: function init() {
        this.setUpDom();
        this.controls();
      }
    }, {
      key: "setUpDom",
      value: function setUpDom() {
        var _this2 = this;

        this.accordion.classList.add('is-ready');
        this.headings.forEach(function (heading) {
          var headingElem = heading;
          var contentElem = heading.nextElementSibling;
          var buttonFrag = createButtons(heading);
          headingElem.textContent = '';
          headingElem.appendChild(buttonFrag);
          var buttonElem = headingElem.getElementsByTagName('button')[0];
          contentElem.id = buttonElem.getAttribute('aria-controls');
          contentElem.hidden = true;

          _this2.content.push(contentElem);

          _this2.buttons.push(buttonElem);
        });
      }
    }, {
      key: "controls",
      value: function controls() {
        var _this3 = this;

        this.buttons.forEach(function (element) {
          element.addEventListener('click', _this3.showHideEvent, false);
        });
      }
    }, {
      key: "showHide",
      value: function showHide(e) {
        var currentTarget = e.currentTarget;
        var currentIndex = this.buttons.indexOf(currentTarget);
        var targetContent = this.content[currentIndex];
        var isHidden = targetContent.hidden;

        if (isHidden) {
          currentTarget.classList.add('is-open');
          currentTarget.setAttribute('aria-expanded', 'true');
          targetContent.hidden = false;
        } else {
          currentTarget.classList.remove('is-open');
          currentTarget.setAttribute('aria-expanded', 'false');
          targetContent.hidden = true;
        }
      }
    }]);

    return Accordion;
  }();

  var ShareThis = /*#__PURE__*/function () {
    function ShareThis() {
      _classCallCheck(this, ShareThis);

      this.sharelinks = document.querySelectorAll('.js-share-this');
    }

    _createClass(ShareThis, [{
      key: "init",
      value: function init() {
        this.controls();
      }
    }, {
      key: "controls",
      value: function controls() {
        var _this = this;

        this.sharelinks.forEach(function (element) {
          element.addEventListener('click', _this.popup, false);
        });
      }
    }, {
      key: "popup",
      value: function popup(e) {
        e.preventDefault();
        popupWindow(this.href, 600, 600);
      }
    }]);

    return ShareThis;
  }();

  var Tabs = /*#__PURE__*/function () {
    function Tabs(element, showTab) {
      var _this = this;

      _classCallCheck(this, Tabs);

      this.tablistClass = '.nsw-tabs__list';
      this.tablistItemClass = '.nsw-tabs__list-item';
      this.tablistLinkClass = '.nsw-tabs__link';
      this.tab = element;
      this.showTab = showTab;
      this.tabList = element.querySelector(this.tablistClass);
      this.tabItems = this.tabList.querySelectorAll(this.tablistItemClass);
      this.allowedKeys = [35, 36, 37, 39, 40];
      this.tabLinks = [];
      this.tabPanel = [];
      this.selectedTab = null;

      this.clickTabEvent = function (e) {
        return _this.clickTab(e);
      };

      this.arrowKeysEvent = function (e) {
        return _this.arrowKeys(e);
      };
    }

    _createClass(Tabs, [{
      key: "init",
      value: function init() {
        this.setUpDom();
        this.controls();
        this.setInitalTab();
      }
    }, {
      key: "setUpDom",
      value: function setUpDom() {
        var _this2 = this;

        this.tab.classList.add('is-ready');
        this.tabList.setAttribute('role', 'tablist');
        this.tabItems.forEach(function (item) {
          var itemElem = item;
          var itemLink = item.querySelector(_this2.tablistLinkClass);

          var panel = _this2.tab.querySelector(itemLink.hash);

          var uID = uniqueId('tab');
          itemElem.setAttribute('role', 'presentation');

          _this2.enhanceTabLink(itemLink, uID);

          _this2.enhanceTabPanel(panel, uID);
        });
      }
    }, {
      key: "enhanceTabLink",
      value: function enhanceTabLink(link, id) {
        link.setAttribute('role', 'tab');
        link.setAttribute('id', id);
        link.setAttribute('aria-selected', false);
        link.setAttribute('tabindex', '-1');
        this.tabLinks.push(link);
      }
    }, {
      key: "enhanceTabPanel",
      value: function enhanceTabPanel(panel, id) {
        var panelElem = panel;
        panelElem.setAttribute('role', 'tabpanel');
        panelElem.setAttribute('role', 'tabpanel');
        panelElem.setAttribute('aria-labelledBy', id);
        panelElem.setAttribute('tabindex', '0');
        panelElem.hidden = true;
        this.tabPanel.push(panelElem);
      }
    }, {
      key: "setInitalTab",
      value: function setInitalTab() {
        var tabItems = this.tabItems,
            tabLinks = this.tabLinks,
            tabPanel = this.tabPanel,
            showTab = this.showTab;
        var index = showTab === undefined ? 0 : showTab;
        var selectedLink = tabLinks[index];
        tabItems[index].classList.add('is-selected');
        selectedLink.removeAttribute('tabindex');
        selectedLink.setAttribute('aria-selected', true);
        tabPanel[index].hidden = false;
        this.selectedTab = selectedLink;
      }
    }, {
      key: "clickTab",
      value: function clickTab(e) {
        e.preventDefault();
        this.switchTabs(e.currentTarget);
      }
    }, {
      key: "switchTabs",
      value: function switchTabs(elem) {
        var clickedTab = elem;

        if (clickedTab !== this.selectedTab) {
          clickedTab.focus();
          clickedTab.removeAttribute('tabindex');
          clickedTab.setAttribute('aria-selected', true);
          this.selectedTab.setAttribute('aria-selected', false);
          this.selectedTab.setAttribute('tabindex', '-1');
          var clickedTabIndex = this.tabLinks.indexOf(clickedTab);
          var selectedTabIndex = this.tabLinks.indexOf(this.selectedTab);
          this.tabItems[clickedTabIndex].classList.add('is-selected');
          this.tabItems[selectedTabIndex].classList.remove('is-selected');
          this.tabPanel[clickedTabIndex].hidden = false;
          this.tabPanel[selectedTabIndex].hidden = true;
          this.selectedTab = clickedTab;
        }
      }
    }, {
      key: "arrowKeys",
      value: function arrowKeys(_ref) {
        var which = _ref.which;
        var linkLength = this.tabLinks.length - 1;
        var index = this.tabLinks.indexOf(this.selectedTab);
        var down = false;

        if (this.allowedKeys.includes(which)) {
          switch (which) {
            case 35:
              index = linkLength;
              break;

            case 36:
              index = 0;
              break;

            case 37:
              index = index === 0 ? linkLength : index -= 1;
              break;

            case 39:
              index = index === linkLength ? 0 : index += 1;
              break;

            case 40:
              down = true;
              break;
          }

          if (down) {
            this.tabPanel[index].focus();
          } else {
            this.switchTabs(this.tabLinks[index]);
          }
        }
      }
    }, {
      key: "controls",
      value: function controls() {
        var _this3 = this;

        this.tabLinks.forEach(function (link) {
          link.addEventListener('click', _this3.clickTabEvent, false);
          link.addEventListener('keydown', _this3.arrowKeysEvent, false);
        });
      }
    }]);

    return Tabs;
  }();

  var SitewideMessage = /*#__PURE__*/function () {
    function SitewideMessage(element) {
      var _this = this;

      _classCallCheck(this, SitewideMessage);

      this.messageElement = element;
      this.closeButton = element.querySelector('.nsw-sitewide-message__close');

      this.closeMessageEvent = function (e) {
        return _this.closeMessage(e);
      };
    }

    _createClass(SitewideMessage, [{
      key: "init",
      value: function init() {
        this.controls();
      }
    }, {
      key: "controls",
      value: function controls() {
        this.closeButton.addEventListener('click', this.closeMessageEvent, false);
      }
    }, {
      key: "closeMessage",
      value: function closeMessage() {
        this.messageElement.hidden = true;
      }
    }]);

    return SitewideMessage;
  }();

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    Element.prototype.closest = function closest(s) {
      var el = this;
      var ancestor = this;
      if (!document.documentElement.contains(el)) return null;

      do {
        if (ancestor.matches(s)) return ancestor;
        ancestor = ancestor.parentElement;
      } while (ancestor !== null);

      return null;
    };
  }

  function initSite() {
    // Header Search
    var openSearchButton = document.querySelectorAll('.js-open-search');
    var closeSearchButton = document.querySelectorAll('.js-close-search');
    var accordions = document.querySelectorAll('.js-accordion');
    var tabs = document.querySelectorAll('.js-tabs');
    var siteMessages = document.querySelectorAll('.js-sitewide-message');
    openSearchButton.forEach(function (element) {
      new SiteSearch(element).init();
    });
    closeSearchButton.forEach(function (element) {
      new SiteSearch(element).init();
    }); // Navigation

    new Navigation().init();
    accordions.forEach(function (element) {
      new Accordion(element).init();
    });

    if (tabs) {
      tabs.forEach(function (element) {
        new Tabs(element).init();
      });
    }

    new ShareThis().init();

    if (siteMessages) {
      siteMessages.forEach(function (element) {
        new SitewideMessage(element).init();
      });
    }
  }

  exports.Accordion = Accordion;
  exports.Navigation = Navigation;
  exports.ShareThis = ShareThis;
  exports.SiteSearch = SiteSearch;
  exports.SitewideMessage = SitewideMessage;
  exports.Tabs = Tabs;
  exports.initSite = initSite;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
