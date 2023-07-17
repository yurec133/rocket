import store from "./redux/store.ts";
import {
  updateButtonLink,
  updateButtonStyle,
  updateButtonText,
  updateDesc,
  updateHeaderText,
  updateTitleLink,
  updateTitleStyle,
  updateTitleText,
} from "./redux/panelSlice.ts";

export function setupGlobalEvents() {
  document.querySelector("#dropzone")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Trigger onMouseOver
  //document.addEventListener('mouseover', event => {
  //    onMouseOver(event);
  //});

  //document.addEventListener('mouseout', event => {
  //    event;
  //    remClassProcessor('border-props');
  //});
}

export function uuidv4() {
  return (
    "uuid" +
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}

export function onDragStart(event: any) {
  console.log(" > onDrag_START() ");

  event.dataTransfer.setData("text/plain", event.target.id);

  event.currentTarget.style.backgroundColor = "yellow";

  onSave(event);
}

export function onDragOver(event: any) {
  console.log(" > onDrag_OVER() ");

  // Remove all previous
  remClassProcessor("border-dotted");

  event.target.classList.add("border-dotted");
  event.preventDefault();
}

export function onDragEnd(event: any) {
  console.log(" > onDrag_END() ");

  // Remove all previous
  remClassProcessor("border-dotted");

  event.dataTransfer.setData("text/plain", event.target.id);
  event.currentTarget.style.backgroundColor = "#4AAE9B";
}



function itemsLS() {
  let itemsArr: any = window.localStorage.getItem("widgetItems");
  if(itemsArr){
    return JSON.parse(itemsArr)
  }
  return {}
}
export function onDrop(event: any) {
  console.log(" > on_DROP() ");

  const id = event.dataTransfer.getData("text");

  let editableComponent = <HTMLElement>(
    document.getElementById(id)!.cloneNode(true)
  );

  console.log(" > CONTAINER: " + event.target.id);
  console.log(" > Component: " + editableComponent.dataset.type);

  // Customization
  editableComponent.id = uuidv4();


  const items = Object.assign(itemsLS(), {
    [editableComponent.id]: editableComponent.outerHTML,
  });

  localStorage.setItem("widgetItems", JSON.stringify(items));

  if (event.target.id?.includes("grid-")) {
    event.target.innerHTML = "";
  }

  //editableComponent.innerHTML += editableComponent.id;
  editableComponent.classList.remove("draggable");
  editableComponent.classList.add("component");
  editableComponent.removeAttribute("draggable");

  // Make it CLICK-able
  editableComponent.addEventListener("click", (event) => {
    onClick(event);
  });

  // Activate Mouse Over
  // editableComponent.addEventListener('mouseover', (event) => { onMouseOver(event); });
  //editableComponent.addEventListener('mouseout', (event) => { event; remClassProcessor('border-props'); });

  // Inject component in the builder
  //const dropzone = <HTMLElement>document.querySelector('#dropzone');
  //dropzone.appendChild(editableComponent);
  event.target.appendChild(editableComponent);

  // Done with this event
  event.dataTransfer.clearData();
}

export function onDelete(element: any) {
  console.log(" > on_DELETE() ");

  element.style.display = "none";
  const localStorageData =
    window.localStorage.getItem("editME")?.split("dropzone")[1] || "";

  var div = document.createElement("div");
  div.id = "dropzone";
  div.innerHTML = localStorageData.trim();

  const children = Array.from(div.children);
  const updatedData = children.filter((item) => item.id !== element.id);

  div.innerHTML = "dropzone";
  updatedData.forEach((item) => {
    div.appendChild(item);
  });

  window.localStorage.setItem("editME", div.innerHTML);
}

export function getElemName(aElement: HTMLElement) {
  let aNodeType = aElement.nodeName;

  if ("P" === aNodeType) {
    return "Paragraph";
  } else if ("A" === aNodeType) {
    return "Anchor";
  } else if ("DIV" === aNodeType) {
    return "DIV";
  } else if ("H5" === aNodeType) {
    return "H5 Tag";
  } else {
    return aNodeType;
  }
}

export function getElemProps(aElement: HTMLElement) {
  let aNodeType = aElement.nodeName;

  if ("P" === aNodeType) {
    return "CSS, HtmlEdit";
  } else if ("A" === aNodeType) {
    return "CSS, HREF"; // + aElement.getAttribute('href');
  } else if ("DIV" === aNodeType) {
    return "CSS, HtmlEdit";
  } else if ("H5" === aNodeType) {
    return "CSS, HtmlEdit";
  } else {
    return aNodeType.trim();
  }
}

export function onMouseOver(event: any) {
  console.log(" > on_MouseOver()");

  if (!event.target.id) {
    event.target.id = uuidv4();
  }

  let elem = <HTMLElement>document.getElementById(event.target.id);

  console.log(" > id: " + elem.id);
  console.log(" > type: " + elem.nodeName);

  let PROPS_TITLE = <HTMLElement>document.getElementById("builder-props-title");
  let PROPS_CONTENT = <HTMLElement>(
    document.getElementById("builder-props-content")
  );

  PROPS_TITLE.innerHTML = elem.id;
  PROPS_CONTENT.innerHTML = "<br /><hr />";
  PROPS_CONTENT.innerHTML +=
    "<strong><center>" + getElemName(elem) + "</center></strong>";
  PROPS_CONTENT.innerHTML += "<hr /><br />";
  PROPS_CONTENT.innerHTML += "<p>" + getElemProps(elem) + "</p>";

  let targetComponent = event.target;

  // Remove previous
  remClassProcessor("border-props");

  // Update CSS
  targetComponent.classList.add("border-props");
}

export function onClick(event: any) {
  console.log(" > on_CLICK() ");

  let targetComponent: any;

  if (event.target.classList.contains("component")) {
    targetComponent = event.target;
  } else {
    targetComponent = event.target.closest(".component");
  }

  if (targetComponent.id && !targetComponent.id.includes("uuid")) {
    //console.log(' > ['+event.target.id+'] NOT a Component, skip the edit');
    console.log(" > GRID Component, skip the edit");
    event.preventDefault();
    return;
  }

  // Save the active Component
  window.localStorage.setItem("activeComponent", targetComponent.id);

  // In place edit
  targetComponent.contentEditable = "false";

  console.log(" > ACTIVE Component:!!!! " + targetComponent.id);

  // Remove previous
  remClassProcessor("border-props");

  // Update CSS
  targetComponent.classList.add("border-dotted");
  // let cardBox = <HTMLElement>(
  //     document.querySelector(".card")
  // );

  if (!hasSiblings(event.target)) {
    event.target.classList.add("border-props");

    let propsPanel_title = <HTMLElement>(
      document.querySelector("#builder-props-title")
    );
    let propsPanel_content = <HTMLElement>(
      document.querySelector("#builder-props-content")
    );
    let propsPanel_link = <HTMLElement>(
      document.querySelector("#builder-props-link")
    );
    let propsPanel_style = <HTMLElement>(
      document.querySelector("#builder-props-style")
    );
    propsPanel_title.innerHTML = "Props for " + targetComponent.id;

    propsPanel_content.innerHTML =
      '<label class="form-label">Text</label><input id="props_text" class="form-control mb-3" data-target="' +
      event.target.id +
      '" value="' +
      event.target.innerHTML +
      '" />';

    const target = event.target;
    let propsPanel_input = <HTMLElement>(
      document.querySelector("input#props_text")
    );
    propsPanel_input.addEventListener("keyup", (event) => {
      onKeyUp(event, target, targetComponent.id);
    });

    if (!target.getAttribute("href")) {
      return (
        (propsPanel_link.innerHTML = ""), (propsPanel_style.innerHTML = "")
      );
    }
    const firstClassName = target.className.split(" ")[0];

    propsPanel_link.innerHTML =
      '<label class="form-label">Link</label><input id="props_text_link_' +
      firstClassName +
      '" class="form-control" data-target="' +
      event.target.id +
      '" value="' +
      target.getAttribute("href") +
      '" />';

    const styleAttribute = target.getAttribute("style") ?? "";
    propsPanel_style.innerHTML =
      '<label class="form-label">Style</label><input placeholder="color: red; background: green;" id="props_text_style_' +
      firstClassName +
      '" class="form-control" value="' +
      styleAttribute +
      '" />';

    let propsPanel_Link = <HTMLElement>(
      document.querySelector(`input#props_text_link_${firstClassName}`)
    );

    let propsPanel_Style = <HTMLElement>(
      document.querySelector(`input#props_text_style_${firstClassName}`)
    );

    propsPanel_Link.addEventListener("keyup", (event) => {
      onKeyUp(event, target, targetComponent.id);
    });
    propsPanel_Style.addEventListener("keyup", (event) => {
      onKeyUp(event, target, targetComponent.id);
    });
  } else {
    console.log(" > Nested COMPONENT, skip PROPS");
  }

  event.stopPropagation();
  event.preventDefault();
}

export function hasSiblings(aNode: HTMLElement) {
  if (!aNode) return false;

  let siblings = [];
  let sibling = aNode.firstChild;

  while (sibling) {
    if (sibling.nodeType === 1) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  if (siblings.length > 0) return true;
  else return false;
}

export function remClassProcessor(aClass: string) {
  let elems = document.getElementsByClassName(aClass);

  if (elems) {
    for (let i = 0; i < elems.length; i++) {
      elems[i].classList.remove(aClass);
    }
  }
}

export function onKeyUp(event: any, target: string, id: any) {
  event;
  //if (event.key === 'Enter' || event.keyCode === 13) {
  // const target_id = event.target.id;
  //console.log(' > Save TEXT for ' + target_id);
  storeDispatch(event, target, id);
  // let activeComponent = document.querySelector("#" + target_id);
  // if (activeComponent) {
  //   activeComponent.innerHTML = event.target.innerHTML;
  // } else {
  //   console.log(" > NULL target:" + target_id);
  // }
  //}
}

export function onClear(event: any) {
  event;
  console.log(" > ACTION: clear");
  let content = <HTMLElement>document.querySelector("#dropzone");
  // clear
  content.innerHTML = "dropzone";
  window.localStorage.clear();
  //let builderContainer = document.querySelector('#layout')!.innerHTML;
  //document.querySelector<HTMLDivElement>('#app')!.innerHTML = builderContainer;
}

export function onSave(event: any) {
  event;
  console.log(" > ACTION: save");
  let content = <HTMLElement>document.querySelector("#dropzone");
  window.localStorage.setItem("editME", content.innerHTML);
}

export function onRestore(event: any) {
  event; // fake the usage

  console.log(" > ACTION: restore");
  let content = <HTMLElement>document.querySelector("#dropzone");

  let saved_contentItems = <string>window.localStorage.getItem("widgetItems");
  // Check that we have data to restore
  if (!saved_contentItems) {
    return;
  }
  const items = JSON.parse(saved_contentItems);
  const itemsString = Object.values(items).join("");


  // update
  content.innerHTML = itemsString;

  let card: any = document.querySelectorAll(".card");

  for (let i = 0; i < card.length; ++i) {
    card[i].classList.add("component");
    card[i].classList.remove("draggable");
  }

  let elems = content.getElementsByClassName("component");

  if (elems) {
    for (let i = 0; i < elems.length; i++) {
      const draggableElement = elems[i];

      draggableElement.addEventListener("click", onClick);

      //const upButton = draggableElement.querySelector('.upButton');
      //const downButton = draggableElement.querySelector('.downButton');
      //const crossButton = draggableElement.querySelector('.cross-icon');
      //const parentElement = draggableElement.parentElement;

      /*
            if (parentElement) {
                if (upButton) {
                    upButton.addEventListener('click', function() {
                        const currentIndex = Array.from(parentElement.children).indexOf(draggableElement);
                        if (currentIndex > 0) {
                            const previousElement = parentElement.children[currentIndex - 1];
                            parentElement.insertBefore(draggableElement, previousElement);
                        }
                    });
                }
                if (downButton) {
                    downButton.addEventListener('click', function() {
                        const currentIndex = Array.from(parentElement.children).indexOf(draggableElement);
                        if (currentIndex < parentElement.children.length - 1) {
                            const nextElement = parentElement.children[currentIndex + 1];
                            parentElement.insertBefore(nextElement, draggableElement);
                        }
                    });
                }
                if (crossButton) {
                    crossButton.addEventListener('click', function() {
                        onDelete(draggableElement);
                    });
                }
            }
            */
    }
  } else {
    console.log(" > NULL ELEMs ");
  }
}

function storeDispatch(e: any, widgetEl: any, id: string) {
  const value = e.target.value;
  const firstClassName = widgetEl.className.split(" ")[0];
  const parentClassName = widgetEl.parentElement.className;

  const isEdit = {
    desc: false,
    buttonText: false,
    buttonLink: false,
    headerText: false,
    titleText: false,
    titleLink: false,
    titleStyle: false,
    buttonStyle: false,
  };

  if (e.target.id === "props_text_style_btn") {
    isEdit.buttonStyle = true;
    store.dispatch(updateButtonStyle(value));
    setValueLS(id, isEdit);
    return null;
  }
  if (e.target.id === "props_text_style_border-props") {
    isEdit.titleStyle = true;
    store.dispatch(updateTitleStyle(value));
    setValueLS(id, isEdit);
    return null;
  }

  if (e.target.id === "props_text_link_btn") {
    isEdit.buttonLink = true;
    store.dispatch(updateButtonLink(value));
    setValueLS(id, isEdit);
    return null;
  }
  if (firstClassName === "btn") {
    isEdit.buttonText = true;
    store.dispatch(updateButtonText(value));
    setValueLS(id, isEdit);
    return null;
  }
  if (firstClassName === "card-text") {
    isEdit.desc = true;
    store.dispatch(updateDesc(value));
    setValueLS(id, isEdit);
    return null;
  }
  if (e.target.id === "props_text_link_border-props") {
    isEdit.titleLink = true;
    store.dispatch(updateTitleLink(value));
    setValueLS(id, isEdit);
    return null;
  }
  if (parentClassName === "card-title") {
    isEdit.titleText = true;
    store.dispatch(updateTitleText(value));
    setValueLS(id, isEdit);
    return null;
  }
  if (parentClassName === "card-header") {
    isEdit.headerText = true;
    store.dispatch(updateHeaderText(value));
    setValueLS(id, isEdit);
    return null;
  }
}

function setValueLS(activeID: string, isEdit: any) {
  let itemsArr: any = window.localStorage.getItem("widgetItems");
  const items = JSON.parse(itemsArr);
  const itemsString = Object.values(items[activeID]).join("");
  let div = document.createElement("div");
  div.innerHTML = itemsString;
  const el: any = div.firstElementChild;
  let cardText = el.querySelector(`#${activeID} .card-text`);
  let btn = el.querySelector(`#${activeID} .btn`);
  let titleLink = el.querySelector(`#${activeID} .card-title a`);
  let headerText = el.querySelector(`#${activeID} .card-header strong`);

  if (isEdit.desc) {
    cardText.textContent = store.getState().panel.desc.toString();
  }
  if (isEdit.headerText) {
    headerText.textContent = store.getState().panel.headerText.toString();
  }
  if (isEdit.buttonText) {
    btn.textContent = store.getState().panel.buttonText.toString();
  }
  if (isEdit.buttonLink) {
    btn.setAttribute("href", store.getState().panel.buttonLink.toString());
  }
  if (isEdit.titleLink) {
    titleLink.setAttribute("href", store.getState().panel.titleLink.toString());
  }
  if (isEdit.titleText) {
    titleLink.textContent = store.getState().panel.titleText.toString();
  }
  if (isEdit.buttonStyle) {
    btn.style.cssText = store.getState().panel.buttonStyle.toString();
  }
  if (isEdit.titleStyle) {
    titleLink.style.cssText = store.getState().panel.titleStyle.toString();
  }

  const itemsWidget = {...items, ...{ [activeID]: el.outerHTML } };
  localStorage.setItem("widgetItems", JSON.stringify(itemsWidget));
  onRestore(null);
}
