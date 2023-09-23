"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


class FlipClock {

  constructor() {

    // arguments
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "flipclock";
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, FlipClock);

    if (_typeof(el) === "object") {
      opt = el;
      el = "flipclock";
    }

    this.version = "0.0.1";
    this.initialised = false;
    this.now = this._getTime();
    // this.epoch = uts;
    this.countdownEnded = false;
    this.hasEndedCallback = null;
    this.element = document.getElementById(el);
    this.rotors = [];
    this.rotorLeafFront = [];
    this.rotorLeafRear = [];
    this.rotorTops = [];
    this.rotorBottoms = [];
    this.countdown = null;
    this.daysRemaining = 0;
    this.clockValues = {};
    this.clockStrings = {};
    this.clockValuesAsString = [];
    this.prevClockValuesAsString = [];
    this.opts = this._parseOptions(opt);

    this._setOptions();

    console.log("FlipClock ".concat(this.version, " (Theme: ").concat(this.opts.theme, ")"));

  }

  _createRotor() {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var rotor = document.createElement("div");
    var rotorLeaf = document.createElement("div");
    var rotorLeafRear = document.createElement("figure");
    var rotorLeafFront = document.createElement("figure");
    var rotorTop = document.createElement("div");
    var rotorBottom = document.createElement("div");
    rotor.className = "rotor";
    rotorLeaf.className = "rotor-leaf";
    rotorLeafRear.className = "rotor-leaf-rear";
    rotorLeafFront.className = "rotor-leaf-front";
    rotorTop.className = "rotor-top";
    rotorBottom.className = "rotor-bottom";
    rotorLeafRear.textContent = v;
    rotorTop.textContent = v;
    rotorBottom.textContent = v;
    appendChildren(rotor, [rotorLeaf, rotorTop, rotorBottom]);
    appendChildren(rotorLeaf, [rotorLeafRear, rotorLeafFront]);
    return rotor;
  }

  _createRotorGroup(rotors, rotorIndex) {
    var rotorGroup = document.createElement("div");
    rotorGroup.className = "rotor-group";
    var dayRotorGroupHeading = document.createElement("div");
    dayRotorGroupHeading.className = "rotor-group-heading";
    dayRotorGroupHeading.setAttribute("data-before", this.opts.headings[rotorIndex]);
    rotorGroup.appendChild(dayRotorGroupHeading);
    appendChildren(rotorGroup, rotors);
    return rotorGroup;
  }

  _getTime() {
    let time_in_seconds = new Date().getTime() / 1000;
    // time_in_seconds -= new Date().getTimezoneOffset() * 60
    console.log(time_in_seconds)
    return time_in_seconds;
  }

  _hasCountdownEnded() {
    return false;
  }

  ifEnded(cb) {
    this.hasEndedCallback = function () {
      cb();
      this.hasEndedCallback = null;
    };

    return this;
  }

  _init() {
    this.initialised = true;

    this.epoch = this._getTime() + 2 * 60 * 60; 

    if (this._hasCountdownEnded()) {
      this.daysremaining = 0;
    } else {
      this.daysremaining = Math.floor((this.epoch - this.now) / 86400).toString().length;
    }

    var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

    for (var i = 0; i < dayRotorCount + 6; i++) {
      this.rotors.push(this._createRotor(0));
    }

    var dayRotors = [];

    for (var i = 0; i < dayRotorCount; i++) {
      dayRotors.push(this.rotors[i]);
    }

    this.element.appendChild(this._createRotorGroup(dayRotors, 0));
    var count = dayRotorCount;

    for (var i = 0; i < 3; i++) {
      var otherRotors = [];

      for (var j = 0; j < 2; j++) {
        otherRotors.push(this.rotors[count]);
        count++;
      }

      this.element.appendChild(this._createRotorGroup(otherRotors, i + 1));
    }

    this.rotorLeafFront = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-leaf-front"));
    this.rotorLeafRear = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-leaf-rear"));
    this.rotorTop = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-top"));
    this.rotorBottom = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-bottom"));

    this._tick();

    this._updateClockValues(true);

    return this;
  }

  _parseOptions(opt) {
    var headings = ["Days", "Hours", "Minutes", "Seconds"];

    if (opt.headings && opt.headings.length === 4) {
      headings = opt.headings;
    }

    return {
      theme: opt.hasOwnProperty("theme") ? opt.theme : "dark",
      headings: headings
    };
  }

  _setOptions() {
    this.element.classList.add("flipdown__theme-".concat(this.opts.theme));
  }

  start() {
    if (!this.initialised) this._init();
    this.countdown = setInterval(this._tick.bind(this), 1000);
    return this;
  }

  _tick() {
    this.now = this._getTime();
    var diff = this.epoch - this.now <= 0 ? 0 : this.epoch - this.now;
    this.clockValues.d = Math.floor(diff / 86400);
    diff -= this.clockValues.d * 86400;
    this.clockValues.h = Math.floor(diff / 3600);
    diff -= this.clockValues.h * 3600;
    this.clockValues.m = Math.floor(diff / 60);
    diff -= this.clockValues.m * 60;
    this.clockValues.s = Math.floor(diff);

    console.log(this.clockValues.d);
    console.log(this.clockValues.h);
    console.log(this.clockValues.m);
    console.log(this.clockValues.s);


    this._updateClockValues();

    this._hasCountdownEnded();
  }

  _updateClockValues() {

    var _this = this;

    var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    this.clockStrings.d = pad(this.clockValues.d, 2);
    this.clockStrings.h = pad(this.clockValues.h, 2);
    this.clockStrings.m = pad(this.clockValues.m, 2);
    this.clockStrings.s = pad(this.clockValues.s, 2);
    this.clockValuesAsString = (
      this.clockStrings.d + 
      this.clockStrings.h + 
      this.clockStrings.m +
      this.clockStrings.s
      ).split("");

    console.log(this.clockValuesAsString)

    this.rotorLeafFront.forEach(function (el, i) {
      el.textContent = _this.prevClockValuesAsString[i];
    });
    this.rotorBottom.forEach(function (el, i) {
      el.textContent = _this.prevClockValuesAsString[i];
    });

    function rotorTopFlip() {
      var _this2 = this;

      this.rotorTop.forEach(function (el, i) {
        if (el.textContent != _this2.clockValuesAsString[i]) {
          el.textContent = _this2.clockValuesAsString[i];
        }
      });
    }

    function rotorLeafRearFlip() {
      var _this3 = this;

      this.rotorLeafRear.forEach(function (el, i) {
        if (el.textContent != _this3.clockValuesAsString[i]) {
          el.textContent = _this3.clockValuesAsString[i];
          el.parentElement.classList.add("flipped");
          var flip = setInterval(function () {
            el.parentElement.classList.remove("flipped");
            clearInterval(flip);
          }.bind(_this3), 500);
        }
      });
    }

    if (!init) {
      setTimeout(rotorTopFlip.bind(this), 500);
      setTimeout(rotorLeafRearFlip.bind(this), 500);
    } else {
      rotorTopFlip.call(this);
      rotorLeafRearFlip.call(this);
    }

    this.prevClockValuesAsString = this.clockValuesAsString;
  }

}

function pad(n, len) {
  n = n.toString();
  return n.length < len ? pad("0" + n, len) : n;
}

function appendChildren(parent, children) {
  children.forEach(function (el) {
    parent.appendChild(el);
  });
}