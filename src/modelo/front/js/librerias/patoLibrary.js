const $$ = document.querySelector.bind(document);

const $$$ = (selector, base) => base.querySelector(selector)

const se = (selector, base = document) => {
    const element = base.querySelectorAll(selector);
    // Extender funcionalidad con un método `val`

    element.value = value; // Asignar valor
    element.classList.remove("vacio"); // Remover clase
    element.classList.add("valorPorFuncion"); // Agregar clase
    element.dispatchEvent(new Event("change")); // Disparar evento 'change'

};
HTMLElement.prototype.valt = function (value) {

    this.value = value; // Asignar valor si el elemento tiene propiedad `value`
    this.classList.add("valorPorFuncion"); // Agregar clase
    this.dispatchEvent(new Event("change")); // Disparar evento 'change'

};
$.fn.valt = function (value) {

    $(this).val(value)
    $(this).addClass("valorPorFuncion"); // Agregar clase
    $(this).trigger("change"); // Disparar evento 'change'

};
$.fn.valInBl = function (value) {

    $(this).val(value)
    $(this).trigger("input");
    $(this).trigger("blur");// Disparar evento 'change'

};
$.fn.valIn = function (value) {

    $(this).val(value)
    $(this).trigger("input");


};