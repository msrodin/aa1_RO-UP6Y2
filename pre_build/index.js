'use strict';

System.register(['rodin/core'], function (_export, _context) {
  "use strict";

  var RODIN, elements, types, mainContainer, draggedObjectOriginalPosition, mouseOriginalPosition, mouseGamepad, plane, mouseToWorld, buttonReady, buttonDown, buttonUp, hover, hoverOut, update, i;
  return {
    setters: [function (_rodinCore) {
      RODIN = _rodinCore;
    }],
    execute: function () {
      RODIN.start();

      elements = [];
      types = [RODIN.Sphere, RODIN.Box];
      mainContainer = new RODIN.Sculpt();

      mainContainer.on(RODIN.CONST.READY, function (evt) {
        RODIN.Scene.add(evt.target);
      });

      draggedObjectOriginalPosition = new THREE.Vector3();
      mouseOriginalPosition = new THREE.Vector3();
      mouseGamepad = null;
      plane = new THREE.Plane();

      mouseToWorld = function mouseToWorld() {
        if (!mouseGamepad) return null;
        var intersection = new THREE.Vector3();
        mouseGamepad.raycaster.ray.intersectPlane(plane, intersection);
        return intersection;
      };

      buttonReady = function buttonReady(evt) {
        var obj = evt.target;
        obj.position.x = Math.random() * 20 - 10;
        obj.position.y = Math.random() * 20 - 10;
        obj.position.z = Math.random() * 20 - 10;
        obj.parent = mainContainer;
      };

      buttonDown = function buttonDown(evt) {
        var obj = evt.target;
        if (evt.gamepad.navigatorGamePadId === 'mouse') {
          navigator.mouseGamePad.stopPropagationOnMouseMove = true;
          mouseGamepad = evt.gamepad;
          plane.setFromNormalAndCoplanarPoint(RODIN.Scene.activeCamera.getWorldDirection(), obj.position);
          mouseOriginalPosition = mouseToWorld();
          draggedObjectOriginalPosition = obj.position.clone();
          obj.dragging = true;
          evt.stopPropagation();
        } else if (evt.gamepad.navigatorGamePadId === 'cardboard') {
          //not ready yet, working on this :) sorry...
          return;
        } else {
          if (obj.oldParent) return;
          obj.oldParent = obj.parent;
          console.log(evt.gamepad);
          obj.parent = evt.gamepad.sculpt;
        }
      };

      buttonUp = function buttonUp(evt) {
        var obj = evt.target;
        if (evt.gamepad.navigatorGamePadId === 'mouse') {
          navigator.mouseGamePad.stopPropagationOnMouseMove = false;
          obj.dragging = false;
        } else if (obj.oldParent) {
          obj.parent = obj.oldParent;
          delete obj.oldParent;
        }
      };

      hover = function hover(evt) {
        evt.target.scale.set(1.1, 1.1, 1.1);
      };

      hoverOut = function hoverOut(evt) {
        evt.target.scale.set(1, 1, 1);
      };

      update = function update(evt) {
        var obj = evt.target;
        if (!obj.dragging) return;
        var mousePos = mouseToWorld();

        obj.position = new THREE.Vector3(draggedObjectOriginalPosition.x - mouseOriginalPosition.x + mousePos.x, draggedObjectOriginalPosition.y - mouseOriginalPosition.y + mousePos.y, draggedObjectOriginalPosition.z - mouseOriginalPosition.z + mousePos.z);
      };

      for (i = 0; i < 40; i++) {
        elements.push(new types[parseInt(Math.random() + 0.5)](.7, .7, .7, new THREE.MeshNormalMaterial()));
        elements[i].on(RODIN.CONST.READY, buttonReady);
        elements[i].on(RODIN.CONST.GAMEPAD_HOVER, hover);
        elements[i].on(RODIN.CONST.GAMEPAD_HOVER_OUT, hoverOut);
        elements[i].on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, buttonDown);
        elements[i].on(RODIN.CONST.GAMEPAD_BUTTON_UP, buttonUp);
        elements[i].on(RODIN.CONST.UPDATE, update);
      }
    }
  };
});