"use strict";
// Project State Management
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, numOfPeople) {
        const newProject = {
            id: Math.random.toString(),
            title: title,
            description: description,
            people: numOfPeople,
        };
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true, errorMessage = "";
    if (validatableInput.required && isValid) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        errorMessage = isValid
            ? ""
            : "Field " + validatableInput.name + " is empty";
    }
    if (validatableInput.minLength != null &&
        isValid &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length >= validatableInput.minLength;
        errorMessage = isValid
            ? ""
            : "Field " + validatableInput.name + " is too short";
    }
    if (validatableInput.maxLength != null &&
        isValid &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length <= validatableInput.maxLength;
        errorMessage = isValid
            ? ""
            : "Field " + validatableInput.name + " is too long";
    }
    if (validatableInput.min != null &&
        isValid &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
        errorMessage = isValid
            ? ""
            : "Field " +
                validatableInput.name +
                " min value is " +
                validatableInput.min;
    }
    if (validatableInput.max != null &&
        isValid &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
        errorMessage = isValid
            ? ""
            : "Field " +
                validatableInput.name +
                " max value is " +
                validatableInput.max;
    }
    if (!isValid) {
        alert(errorMessage);
    }
    return isValid;
}
// Autobind decorator
function Autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
// ProjectList Class
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        this.assignedProjects = [];
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.attach();
        this.rederContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }
    rederContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
// ProjectInput Class
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable = {
            name: "title",
            value: enteredTitle,
            required: true,
            minLength: 3,
            maxLength: 20,
        };
        const descriptionValidatable = {
            name: "description",
            value: enteredDescription,
            required: true,
            minLength: 5,
            maxLength: 500,
        };
        const peopleValidatable = {
            name: "people",
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            return;
        }
        return [enteredTitle, enteredDescription, +enteredPeople];
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
//# sourceMappingURL=app.js.map